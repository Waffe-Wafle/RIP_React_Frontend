import { Link } from 'react-router-dom';
import imgPlaceholder from '../../hooks_and_utils/imgPlaceholder';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import useFetch from '../../hooks_and_utils/useFetch.js';
import { SoftAPI, getStatus } from '../../api';
import { Col } from 'react-bootstrap';


interface PaymentCardProps {
    payment: {
        id: number;
        code: string;
        price: number;
        date_open: string;
        status: string;
    };
    handleDel: (paymentId: number) => void;
}


const PaymentCard: React.FC<PaymentCardProps> = ({ payment, handleDel }) => {
    const [softList, setSoftList] = useState<{ id: number; name: string }[]>([]);

    const { data, loading, error, doFetch } = useFetch(
        `${SoftAPI}payments/${payment.id}/`,
        //@ts-ignore
        {
            method: 'GET',
        },
        (data) => setSoftList(data.soft)
    );

    useEffect(() => {
        doFetch();
    }, []);

    return (
        <tr key={payment.id}>
            <td>{payment.code}</td>
            <td>{payment.price}</td>
            <td>{payment.date_open}</td>
            <td>{getStatus(payment.status)[1]}</td>
            <td>
                <div className="d-flex justify-center text-center flex-column align-center">
                    {softList.map((soft) => (
                        <Button
                            key={soft.id}
                            className="small btn btn-primary mb-10 btn-sm text-muted w-75"
                            href={`#/soft/${soft.id}`}
                        >
                            {soft.name}
                        </Button>
                    ))}
                </div>
            </td>
            <td>
                <div className="d-flex justify-center text-center">
                    <Button
                        className=" btn-sm"
                        variant="danger"
                        onClick={() => handleDel(payment.id)}
                    >
                        Удалить
                    </Button>
                </div>
            </td>
        </tr>

    );
};

export default PaymentCard;
