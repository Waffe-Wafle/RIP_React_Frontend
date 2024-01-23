import React, { FC, useEffect, useState } from "react";
import Header from "../parts_share/Header";
import SiteNavbar from "../parts_share/SiteNavbar";
import CurrentPath from "../parts/CurrentPath";
import SearchField from "../parts/SearchField";
import CatalogCard from '../parts/CatalogCard.tsx';
import NavDropdown from "react-bootstrap/NavDropdown";
import { Col, Row, Button } from "react-bootstrap";
import useFetch from "../../hooks_and_utils/useFetch";
import { SoftAPI } from "../../api";
import LoadingPopUp from "../popups/LoadingPopUp";
import MOCK from "../../MOCK";


const Catalog: FC = () => {
    const [soft, setSoft] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [priceSort, setPriceSort] = useState<string>('');

    const [loadingShown, setLoadingShown] = useState<boolean>(false);

    // Fetch (for downloading soft and search) logic:
    const callback = (data: any) => {
        setSoft(data.soft_list);
        console.log(data.soft_list);
        setLoadingShown(false);
    };

    const { data, loading, error, doFetch } = useFetch(
        SoftAPI + `softs/?search=${searchValue}&cheap=${priceSort}`,
        { method: 'GET' },
        callback
    );

    useEffect(() => {
        doFetch();
    }, []);

    // Filter logic:
    const handleFilter = (dir: string) => {
        setPriceSort(dir);
        doFetch();
    };

    // Popup and mock logic:
    const handleClose = () =>
        loading ? undefined : setLoadingShown(false);

    useEffect(() => {
        if (loading || error) setLoadingShown(true);
        if (error) setSoft(MOCK);
    }, [loading, error]);

    return (
        <div className="wrapper clear">
            <LoadingPopUp show={loadingShown} error={error} onClose={handleClose} message={'Идет загрузка...'} />
            <Header />
            <SiteNavbar />
            <CurrentPath links={[['Главная', '/info'], ['Каталог', '/catalog']]} />
            <div className="content p-15">
                <div className="d-flex align-center justify-between mb-40">
                    <h2 className="mb-0">Программы <Button onClick={doFetch}>Обновить</Button></h2>
                    <div className="d-flex align-center justify-between content">
                        <NavDropdown title="Сортировать:" id="basic-nav-dropdown" className="mr-20">
                            <NavDropdown.Item onClick={() => {
                                handleFilter("down");
                            }}>
                                Сначала дорогие
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {
                                handleFilter("up");
                            }}>Сначала дешевые</NavDropdown.Item>
                        </NavDropdown>
                        <SearchField value={searchValue} setValue={setSearchValue} loading={loading}
                                     onSubmit={doFetch} buttonTitle="Искать" />
                    </div>
                </div>
                <div className="d-flex">
                    {!soft.length ? <h1>Каталог пуст..</h1> :
                        <Row md={4} className="g-4">
                            {soft.map((_soft, index) => (
                                _soft ?
                                    <Col key={index}>
                                        <CatalogCard {..._soft} />
                                    </Col> : ''
                            ))}
                        </Row>
                    }
                </div>
            </div>
        </div>
    );
};

export default Catalog;
