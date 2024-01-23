import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../parts_share/Header";
import SiteNavbar from "../parts_share/SiteNavbar";
import CurrentPath from "../parts/CurrentPath";
import BasketCard from "../parts/BasketCard";
import useFetch from "../../hooks_and_utils/useFetch";
import { SoftAPI } from "../../api.js";
import {
    useBasket,
    clearBasket,
    storeBasket,
    useSum,
    addPayment,
    clearCurrentSoft,
    useDraftId,
    setDraftId,
} from "../../redux/dataSlice";
import LoadingPopUp from "../popups/LoadingPopUp";
import Button from "react-bootstrap/Button";
import ConfirmationPopUp from "../popups/ConfirmationPopUp";

interface Soft {
    id: number;
}

// @ts-ignore
const Basket: React.FC = ({fetchBrake = false}) => {
    const draftId = useDraftId();
    const storedBasket = useBasket();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [SoftRemoved, setSoftRemoved] = useState<Soft | {}>({});
    const [isAppyRequest, setIsApplyRequest] = useState<boolean>(false);

    const [confirmationShown, setConfirmationShown] = useState<boolean>(false);
    const [loadingShown, setLoadingShown] = useState<boolean>(false);

    // Fetch (to get draft) logic:
    const loadDraftCallback = (data) => {
        dispatch(storeBasket(data));
        setLoadingShown(false);
    };

    const {
        data: getDraftData,
        loading: getDraftLoading,
        error: getDraftError,
        doFetch: getDraftDoFetch,
    } = useFetch(
        SoftAPI + "payments/" + draftId + "/",
        //@ts-ignore
        { method: "GET" }, loadDraftCallback
    );

    useEffect(() => {
        if (!storedBasket && draftId && !fetchBrake) getDraftDoFetch();
    }, [draftId, fetchBrake]);

    // Fetch (for draft managing) logic:
    const manageDraftCallback = (data) => {
        if (isAppyRequest) {
            dispatch(addPayment(data));
            dispatch(clearBasket());
            dispatch(clearCurrentSoft());
            dispatch(setDraftId(null));
            navigate("/my_payments/");
        } else dispatch(storeBasket(data));
        setLoadingShown(false);
    };

    const {
        data: manageDraftData,
        loading: manageDraftLoading,
        error: manageDraftError,
        doFetch: manageDraftDoFetch,
    } = useFetch(
        SoftAPI + (isAppyRequest ? "manage_payment_status/" : "manage_payment_soft/"),
        //@ts-ignore
        {
            method: isAppyRequest ? "PUT" : "DELETE",
            data: isAppyRequest ? "" : { soft: (SoftRemoved as Soft).id }
        }, manageDraftCallback
    );

    // Del from basket:
    const delFromBasket = (soft: Soft) => {
        setSoftRemoved(soft);
        setIsApplyRequest(false);
        manageDraftDoFetch();
    };

    // Doing request:
    const applyRequest = () => {
        setIsApplyRequest(true);
        manageDraftDoFetch();
    };

    // Confirmation logic:
    const handleConfirmation = (confirm: boolean) => {
        if (confirm) applyRequest();
        setConfirmationShown(false);
    };

    // Popups logic:
    const handleClose = () => {
        if (!(getDraftLoading || manageDraftLoading)) setLoadingShown(false);
    };

    useEffect(() => {
        if (getDraftLoading || manageDraftLoading || getDraftError || manageDraftError)
            setLoadingShown(true);
    }, [getDraftLoading, manageDraftLoading, getDraftError, manageDraftError]);

    return (
        <div className="wrapper clear">
            <ConfirmationPopUp
                show={confirmationShown}
                title="Подтвердить?"
                message={{
                    question: "Заявка будет сформирована как оплаченная",
                    confirm: "Да",
                    reject: "Нет",
                }}
                result={handleConfirmation}
            />
            <LoadingPopUp
                show={loadingShown}
                error={manageDraftError ? manageDraftError : getDraftError}
                onClose={handleClose}
                message={"Пожалуйста, подождите..."}
            />
            <Header />
            <SiteNavbar />
            <CurrentPath links={[["Главная", "/info"], ["Каталог", "/catalog"], ["Заявка", ""]]}/>
            <div className="content p-15">
                <div className="d-flex justify-content-center">
                    <div className="d-inline-block"><h2 className="">Заявка</h2>
                        <div>Код оплаты: {storedBasket.code}</div>
                        <div>Сумма заказа: {storedBasket.price} ₽</div>
                    </div>
                </div>
                {!storedBasket.soft || storedBasket.soft.length === 0 ? (
                    <h5 className="m-20 text-center ">Нет программ... </h5>
                ) : (
                    <div className="ml-40 mb-10">
                        {storedBasket.soft.map((soft: Soft) => (
                            //@ts-ignore
                            <BasketCard key={soft.id} soft={soft} handleDel={delFromBasket} />
                        ))}
                        <div className="mt-35 d-flex justify-content-center ">
                            <Button className="col-sm-4" onClick={() => setConfirmationShown(true)}>
                                Заказать
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Basket;
