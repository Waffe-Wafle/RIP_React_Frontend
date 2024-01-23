import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Header from "../parts_share/Header";
import SiteNavbar from "../parts_share/SiteNavbar";
import CurrentPath from "../parts/CurrentPath";
import SearchField from "../parts/SearchField";
import CatalogCard from "../parts/CatalogCard";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Col, Row, Button } from "react-bootstrap";
import useFetch from "../../hooks_and_utils/useFetch.js";
import { SoftAPI } from "../../api";
import {
    storeSoft,
    useStoredSoft,
    useIsAuthenticated,
    setDraftId,
    useRefreshView,
    storeBasket, setRefreshView
} from "../../redux/dataSlice";
import LoadingPopUp from "../popups/LoadingPopUp";
import Payments from "./Payments";
import Basket from "./Basket";
import catalogFilter from "../../hooks_and_utils/catalogFilters";


interface Soft {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
}


const Catalog: React.FC = () => {
    //@ts-ignore
    Payments({fetchBrake: !useIsAuthenticated(), pollingBrake: true});
    Basket({fetchBrake: !useIsAuthenticated()});

    const storedSoft = Object.values(useStoredSoft()) as Soft[];
    const dispatch = useDispatch();
    const refreshView = useRefreshView();

    const [soft, setSoft] = useState<Soft[]>(storedSoft); // Used like that not to sort storage every time
    const [searchValue, setSearchValue] = useState<string>("");
    const [priceSort, setPriceSort] = useState<"up" | "down">("up")
    const [softIdToBasket, setSoftIdToBasket] = useState<number | null>(null);

    const [loadingShown, setLoadingShown] = useState<boolean>(false);

    // Fetch (for downloading soft and search) logic:
    const callback = (data) => {
        if (!searchValue) dispatch(storeSoft(data.soft_list as Soft[]));
        setSoft(data.soft_list as Soft[]);

        dispatch(setDraftId(data.draft_id));
        setLoadingShown(false);
    };

    //@ts-ignore
    const { data, loading, error, doFetch } = useFetch(
        SoftAPI + `softs/?search=${searchValue}&cheap=${priceSort}`,
        { method: "GET" }, callback);

    useEffect(() => {
        if ((!storedSoft.length) || refreshView) {
            doFetch();
            dispatch(setRefreshView(false));
        }
    }, [refreshView]);

    //Logic for putting into basket:
    const putToBasketCallback = data => {
        dispatch(storeBasket(data));
        setSoftIdToBasket(null);
        setLoadingShown(false);
    };

    const { data: basketData, loading: basketLoading, error: basketError, doFetch: basketDoFetch } = useFetch(
        SoftAPI + 'manage_payment_soft/',
        //@ts-ignore
        {
            method: 'PUT',
            data: { soft: softIdToBasket }
        },
        putToBasketCallback
    );

    const putToBasket = id => {
        setSoftIdToBasket(id);
        basketDoFetch();
    };

    //Local filters logic:
    const localFilter = () =>
        setSoft(catalogFilter(storedSoft, searchValue, priceSort));

    // Search logic:
    const handeSearch = () => searchValue ? doFetch() : localFilter();

    // Filter logic:
    const handleCheapFilter = (direction: "up" | "down") => {
        setPriceSort(direction);
        doFetch();
    };

    // Popup and filter logic:
    const handleClose = () => (loading || basketLoading ? undefined : setLoadingShown(false));

    useEffect(() => {
        if (loading || basketLoading || error || basketError) setLoadingShown(true);
        if (error) localFilter();
    }, [loading, basketLoading, error, basketError]);
    return (
        <div className="wrapper clear">
            <LoadingPopUp
                show={loadingShown}
                error={error ? error : basketError}
                onClose={handleClose}
                message={softIdToBasket ? "Добавление в заявку.." : "Идет загрузка..."}
            />
            <Header />
            <SiteNavbar />
            <CurrentPath links={[["Главная", "/info"], ["Каталог", "/catalog"]]}/>
            <div className="content p-15">
                <div className="d-flex align-center justify-between mb-20 mb-sm-40 search_header">
                    <h2 className="mb-10 mb-sm-0">
                        Программы
                    </h2>
                    <div className="d-flex align-center justify-between content search_header1">
                        <NavDropdown title="Сортировать:" id="basic-nav-dropdown" className="mr-20">
                            <NavDropdown.Item onClick={() => handleCheapFilter("down")}>
                                Сначала дорогие
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleCheapFilter("up")}>
                                Сначала дешевые
                            </NavDropdown.Item>
                        </NavDropdown>
                        <SearchField
                            value={searchValue}
                            setValue={setSearchValue}
                            loading={loading}
                            onSubmit={handeSearch}
                            buttonTitle="Искать"
                        />
                    </div>
                </div>
                <div className="d-flex">
                    {!soft.length ? <h5>Каталог пуст..</h5> : (
                        <Row md={4} className="g-4">
                            {soft.map((_soft, index) =>
                                _soft &&
                                    <Col key={index}>
                                        <CatalogCard soft={_soft} putToBasket={putToBasket} />
                                    </Col>
                            )}
                        </Row>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
