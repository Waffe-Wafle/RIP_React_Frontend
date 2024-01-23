import React, { FC } from "react";
import {Link, useNavigate} from "react-router-dom";
import imgPlaceholder from "../../hooks_and_utils/imgPlaceholder";
import shortField from "../../hooks_and_utils/short_field";
import { useIsAuthenticated, useIsInBasketByID, useIsRequestedByID, useIsStaff } from "../../redux/dataSlice";


interface CatalogCardProps {
    soft: {
        id: number;
        name: string;
        description: string;
        price: number;
        image?: string;
    };
    putToBasket: (id: string) => void;
}


const CatalogCard: FC<CatalogCardProps> = ({ soft, putToBasket}) => {
    const isStaff = useIsStaff();
    const isAuthenticated = useIsAuthenticated();

    const isInBasket = useIsInBasketByID(soft.id);
    const isRequestedBefore = useIsRequestedByID(soft.id);

    const navigate = useNavigate();

    const handleClick = () => {
        console.log(isInBasket)
        if (isInBasket) {
            navigate('/basket');
        } else if (isRequestedBefore) {
            navigate('/my_payments');
        } else {
            putToBasket(soft.id);
        }
    };

    const getButton = () => {
        if (isInBasket) return "/src/plus_button_basket_or_payments.png";
        if (isRequestedBefore) return "/src/plus_button_enabled.png";
        return "/src/plus_button.png";
    };

    return (
        <Link to={`/soft/${soft.id}`}>
            <div className="card">
                <div className="text-center">
                    <img
                        className="skrug w-100"
                        src={soft.image ? soft.image : process.env.PUBLIC_URL + "/src/card_img_placeholder.jpg"}
                        alt="Soft Image"
                        onError={imgPlaceholder}
                    />
                </div>
                <div className="d-flex justify-between align-center">
                    <div className="d-flex flex-column">
                        <span>Название:</span>
                        <b>{shortField(soft.name)}</b>
                        <span>Описание:</span>
                        <b>{shortField(soft.description)}</b>
                        <span>Цена:</span>
                        <b>{soft.price}</b>
                    </div>
                    {!isStaff && isAuthenticated && (
                        <img
                            onClick={e => {e.preventDefault(); handleClick()}}
                            width={30}
                            height={30}
                            src={process.env.PUBLIC_URL + getButton()}
                            alt="Plus Button"
                        />
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CatalogCard;
