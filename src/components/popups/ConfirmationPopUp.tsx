import React from "react";
import { memo } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Title from "../parts_share/TextTitle";


interface ConfirmationPopUpProps {
    show: boolean;
    title: string;
    message: {
        question: string;
        confirm: string;
        reject: string;
    };
    result: (confirm: boolean) => void;
}


const ConfirmationPopUp: React.FC<ConfirmationPopUpProps> = ({ show, title, message, result }) => {
    return (
        <Modal show={show} centered>
            <Modal.Body className="text-center">
                <Title text={title} />
                <div className="mt-3">{message.question}</div>
                <div className="d-flex justify-content-center mt-3">
                    <Button className="mr-25 w-25" variant="success" onClick={() => result(true)}>{message.confirm}</Button>
                    <Button className="ml-25 w-25" variant="danger" onClick={() => result(false)}>{message.reject}</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default memo(ConfirmationPopUp);
