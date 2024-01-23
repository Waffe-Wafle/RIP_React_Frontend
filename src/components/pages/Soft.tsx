import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router";
import Header from "../parts_share/Header";
import SiteNavbar from "../parts_share/SiteNavbar";
import CurrentPath from "../parts/CurrentPath";
import Button from "react-bootstrap/Button";
import useFetch from "../../hooks_and_utils/useFetch.js";
import {SoftAPI} from "../../api";
import {
    storeBasket,
    useIsSoftAviableByID,
    useIsRequestedByID, useIsInBasketByID, useIsAuthenticated, setCurrentSoft
} from "../../redux/dataSlice.js";
import LoadingPopUp from "../popups/LoadingPopUp";
import imgPlaceholder from "../../hooks_and_utils/imgPlaceholder";
import FileCard from "../parts/FileCard";
import Basket from "./Basket";


function Soft() {
    //@ts-ignore
    Basket({});

    const softId = parseInt(useParams().soft_id, 10);

    const isAuthenticated = useIsAuthenticated();
    const isInBasket = useIsInBasketByID(softId);
    const isRequestedBefore = useIsRequestedByID(softId);

    const isAviable = useIsSoftAviableByID(softId);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isBasketRequest, setIsBasketRequest] = useState(false);
    const [loadingShown, setLoadingShown] = useState(false);

    // Fetch for soft logic:
    const callback = data => {
        if (isBasketRequest) {
            dispatch(storeBasket(data));
            setIsBasketRequest(false);
        }
        else dispatch(setCurrentSoft(data));
        setLoadingShown(false);
    };


    const {data: soft, loading: softLoading, error: softError, doFetch: softDoFetch} = useFetch(
        SoftAPI + 'softs/' + softId,
        //@ts-ignore
        {method: 'GET'},
        callback
    );

    useEffect(() => softDoFetch(), []);

    // For draft logic:
    const {data: basketData, loading: basketLoading, error: basketError, doFetch: basketDoFetch} = useFetch(
        SoftAPI + 'manage_payment_soft/',
        //@ts-ignore
        {
            method: 'PUT',
            data:  {soft: softId}
        },
        callback
    );

    // Putting to basket:
    const handlePutToBasket = () => {
        if (isInBasket) navigate('/basket')
        else {
            setIsBasketRequest(true);
            basketDoFetch();
        }
    };

    // Popup logic:
    useEffect(() => {
        if (softLoading || basketLoading ||
            softError || basketError) setLoadingShown(true)
        }, [softLoading, basketLoading, softError, basketError]
    );

    const handleClose = () => {
        if (!(softLoading || basketLoading)) setLoadingShown(false);
    }

    return (
        <div className="wrapper clear">
            <LoadingPopUp show={loadingShown} error={softError ? softError : basketError} onClose={handleClose}
                          message={isBasketRequest ? 'Добавляется в заявку...' : 'Открывается...'}/>
            <Header/>
            <SiteNavbar/>
            <CurrentPath links={[
                ['Главная', '/info'],
                ['Каталог', '/catalog'],
                [soft.name, '']
            ]}/>

            <ul className="content p-15 flex-row">
                {loadingShown ?
                    <h2>...</h2> :
                    <>
                        <h2 className="mb-0 d-flex flex-column flex-sm-row justify-between sm text-center">{soft.name}
                            <div className="mt-10 mt-sm-0">
                                {!isAuthenticated ?
                                    <li>Чтобы взаимодействовать, пожалуйста, авторизуйтесь</li> :
                                    <div className="mt-10 mt-sm-0">
                                        {isAviable ? '' : (
                                            isRequestedBefore ?
                                                <Button className="w-100" href='#/my_payments'>
                                                    Просмотреть в заказах</Button> :
                                        <Button className="btn-sm w-100" onClick={handlePutToBasket}>
                                            {isInBasket ? 'Открыть в заявке' : 'Добавить в заявку'}</Button>
                                )}
                                    </div>
                                }
                            </div>
                        </h2>
                        <div className="text-center">
                            <img className="wrapper align-center mt-25 mb-20 w-75"
                                 src={soft.image} onError={e => imgPlaceholder(e)}/>
                            <h3>Цена: {soft.price} ₽</h3>
                        </div>

                        <h3>Описание:</h3>
                        <li className="mb-25 ml-25">{soft.description}</li>
                        <h3 className="mb-0">Файлы:</h3>
                        <div className="w-100 text-center">
                            <div className="mt-15 d-inline-block">
                                {!(soft.files && soft.files.length) ? <h2>...</h2> :
                                    soft.files.map(file => (
                                        <FileCard file={file} saveEnabled={isAviable} />)
                                    )
                                }
                            </div>
                        </div>
                    </>
                }

            </ul>
        </div>
    );
}

export default Soft;