import React, { FC } from "react";
import { Link } from "react-router-dom";
import imgPlaceholder from "../../hooks_and_utils/imgPlaceholder";
import shortField from "../../hooks_and_utils/short_field";


interface CatalogCardProps {
    id: string;
    name: string;
    description: string;
    price: string;
    image?: string;
}


const CatalogCard: FC<CatalogCardProps> = ({
                                               id,
                                               name,
                                               description,
                                               price,
                                               image,
                                           }) => {
    return (
        <Link to={`/soft/${id}`}>
            <div className="card">
                <div className="text-center">
                    <img
                        className="skrug w-100"
                        src={image ? image : process.env.PUBLIC_URL + "/src/card_img_placeholder.jpg"}
                        alt="Soft Image"
                        onError={imgPlaceholder}
                    />
                </div>
                <div className="d-flex justify-between align-center">
                    <div className="d-flex flex-column">
                        <span>Название:</span>
                        <b>{shortField(name)}</b>
                        <span>Описание:</span>
                        <b>{shortField(description)}</b>
                        <span>Цена:</span>
                        <b>{price}</b>
                    </div>
                    <img
                        width={30}
                        height={30}
                        src={process.env.PUBLIC_URL + "/src/plus_button.png"}
                        alt="Plus Button"
                    />
                </div>
            </div>
        </Link>
    );
};

export default CatalogCard;
