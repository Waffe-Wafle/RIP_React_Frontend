import React from 'react';
import Button from 'react-bootstrap/Button';
import imgPlaceholder from '../../hooks_and_utils/imgPlaceholder';

interface BasketCardProps {
    soft: {
        image: string;
        name: string;
        price: number;
    };
    handleDel: (soft: { image: string; name: string; price: number }) => void;
}

const BasketCard: React.FC<BasketCardProps> = ({ soft, handleDel }) => {
    return (
        <div className="mr-30 ml-30 d-flex flex-column align-items-center mt-5 mb-3 flex-sm-row justify-content-sm-between">
            <img
                className="skrug mb-3 mb-sm-0"
                width={200}
                height={150}
                src={soft.image ? soft.image : process.env.PUBLIC_URL + "/src/card_img_placeholder.jpg"}
                alt={`Product: ${soft.name}`}
                onError={(e) => imgPlaceholder(e)}
            />
            <div className="d-flex flex-column ml-sm-3">
        <span>
          Название: <b>{soft.name}</b>
        </span>
                <span>
          Цена: <b>{soft.price}</b>
        </span>
            </div>
            <Button className="mt-2" onClick={() => handleDel(soft)} variant="danger">
                Удалить
            </Button>
        </div>
    );
};

export default BasketCard;