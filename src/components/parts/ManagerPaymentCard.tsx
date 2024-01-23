import React from 'react';
import {Button} from 'react-bootstrap';
import {getStatus} from '../../api';

interface ManagerPaymentCardProps {
    payment: {
        date_open: string;
        code: string;
        price: string;
        status: string;
        id: number;
    };
    setStatus: (status: string, id: string) => void;
}

const ManagerPaymentCard: React.FC<ManagerPaymentCardProps> = ({payment, setStatus}) => {
    const isPaid = payment.status === 'paid';

    const handleConfirm = () => {
        //@ts-ignore
        setStatus('completed', payment.id);
    };

    const handleReject = () => {
        //@ts-ignore
        setStatus('rejected', payment.id);
    };

    return (
        <tr key={payment.id}>
            <td>{payment.date_open}</td>
            <td>{payment.code}</td>
            <td>{payment.price}</td>
            <td>{getStatus(payment.status)[1]}</td>
            <td>
                <div className="d-flex justify-center ">
                    {isPaid && (
                        <>
                        <Button
                            className="btn-sm"
                            variant="success"
                            onClick={() => handleConfirm()}
                        >
                            Принять
                        </Button>
                        <Button
                        className="btn-sm ml-10"
                        variant="danger"
                        onClick={() => handleReject()}
                        >
                        Отклонить
                        </Button>
                        </>
                        )}
                </div>
            </td>


        </tr>
    );
};


export default ManagerPaymentCard;
