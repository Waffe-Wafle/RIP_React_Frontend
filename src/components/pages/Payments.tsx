import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Header from "../parts_share/Header";
import SiteNavbar from "../parts_share/SiteNavbar";
import CurrentPath from "../parts/CurrentPath";
import { Col, Row, Button } from "react-bootstrap";
import PaymentCard from "../parts/PaymentCard";
import useFetch from "../../hooks_and_utils/useFetch.js";
import { SoftAPI } from "../../api";
import {
    useStoredPayments,
    storePayments,
    deletePaymentByID,
} from "../../redux/dataSlice";
import LoadingPopUp from "../popups/LoadingPopUp";
import ConfirmationPopUp from "../popups/ConfirmationPopUp";


interface Payment {
    id: number;
    price: number;
    code: string;
    status: string;
    date_open: string;
    date_pay: string | null;
    date_close: string | null;
    user: number;
    manager: number;
    soft: number[];
}


// @ts-ignore
const Payments: React.FC = ({fetchBrake = false, pollingBrake=false}) => {
    const storedPayments = Object.values(useStoredPayments()) as Payment[];
    const dispatch = useDispatch();

    const [loadingShown, setLoadingShown] = useState<boolean>(false);
    const [confirmationShown, setConfirmationShown] = useState<boolean>(false);

    const [payId, setPayId] = useState<number | null>(null);

    // Fetch (for downloading payments) logic:
    const callback = (data) => {
        if (payId) {
            dispatch(deletePaymentByID(payId));
            setPayId(null);
        } else dispatch(storePayments(data as Payment[]));
        setLoadingShown(false);
    };

    const { data, loading, error, doFetch } = useFetch(
        SoftAPI + "payments/" + (payId ? payId + "/" : ""),
        //@ts-ignore
        {
            method: payId ? "DELETE" : "GET",
        },
        callback
    );

    useEffect(() => {
        if (!storedPayments.length && !fetchBrake) doFetch();
    }, [fetchBrake]);

    // Short polling logic:
    const {data: pollingData, loading: pollingLoading, error: pollingError, doFetch: pollingDoFetc} = useFetch(
        SoftAPI + "payments/",
        {method: 'GET'},
        data => dispatch(storePayments(data))
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            if(!fetchBrake && !pollingBrake) pollingDoFetc();
        }, 200);

        return () => clearInterval(intervalId);
    }, [fetchBrake, pollingBrake]);

    // Del logic:
    const handleDel = (id: number) => {
        setPayId(id);
        setConfirmationShown(true);
    };

    const handleConfirmation = (confirm: boolean) => {
        if (confirm) doFetch();
        setConfirmationShown(false);
    };

    // Popup logic:
    const handleClose = () => (loading ? undefined : setLoadingShown(false));

    useEffect(() => (loading || error ? setLoadingShown(true) : undefined), [
        loading,
        error,
    ]);

    return (
        <div className="wrapper clear ">
            <ConfirmationPopUp
                show={confirmationShown}
                title="Подтвердить?"
                message={{
                    question: "Заявка будет удалена",
                    confirm: "Да",
                    reject: "Нет",
                }}
                result={handleConfirmation}
            />
            <LoadingPopUp
                show={loadingShown}
                error={error}
                onClose={handleClose}
                message={"Идет загрузка..."}
            />
            <Header />
            <SiteNavbar />
            <CurrentPath
                links={[
                    ["Главная", "/info"],
                    ["Каталог", "/catalog"],
                    ["Мои заказы", "/my_payments"],
                ]}
            />
            <div className="content p-15">
                {/*<h2 className="mb-20 text-center">*/}
                {/*    Все заказы <Button onClick={doFetch}>Обновить</Button>*/}
                {/*</h2>*/}
                {!storedPayments.length ? (
                    <h5 className="text-center m-20">Заказы отсутствуют...</h5>
                ) : (
                    <table className="table text-center">
                        <thead>
                        <tr>
                            <th>Код оплаты</th>
                            <th>Цена</th>
                            <th>Забронировано</th>
                            <th>Статус</th>
                            <th>Программы</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {storedPayments.map((payment: any, index) => (
                            <PaymentCard key={index} payment={payment} handleDel={handleDel} />
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Payments;
