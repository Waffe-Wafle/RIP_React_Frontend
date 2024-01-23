import React, { useEffect, memo } from "react";
import Modal from "react-bootstrap/Modal";
import Title from "../parts_share/TextTitle";


interface MessagePopupProps {
    show: boolean;
    title: string;
    message: string;
    onClose: () => void;
}


const MessagePopup: React.FC<MessagePopupProps> = ({ show, title, message, onClose }) => {


    useEffect(() => {
        document.addEventListener('click', onClose);
        return () => {
            document.removeEventListener('click', onClose);
        };
    }, );

    return (
        <Modal show={show} centered>
            <Modal.Body className="text-center">
                <Title text={title} />
                <div className="mt-3">{message}</div>
            </Modal.Body>
        </Modal>
    );
};

export default MessagePopup;
