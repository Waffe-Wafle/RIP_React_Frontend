import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../parts_share/Header";
import SiteNavbar from "../parts_share/SiteNavbar";
import CurrentPath from "../parts/CurrentPath";
import useFetch from "../../hooks_and_utils/useFetch";
import { SoftAPI } from "../../api";
import LoadingPopUp from "../popups/LoadingPopUp";
import imgPlaceholder from "../../hooks_and_utils/imgPlaceholder";
import FileCard from "../parts/FileCard";
import MOCK from "../../MOCK";


interface SoftProps {}


const Soft: FC<SoftProps> = () => {
    const { soft_id } = useParams();
    const softId = parseInt(soft_id, 10);

    const [soft, setSoft] = useState<any>({});
    const [loadingShown, setLoadingShown] = useState(false);

    const callback = (data: any) => {
        setSoft(data);
        setLoadingShown(false);
    };

    const { data, loading, error, doFetch } = useFetch(
        `${SoftAPI}softs/${softId}/`,
        { method: 'GET' },
        callback
    );

    useEffect(() => {
        doFetch();
    }, []);

    // Popup logic:
    const handleClose = () => (loading ? undefined : setLoadingShown(false));

    useEffect(() => {
        if (loading || error) setLoadingShown(true);
        if (error) setSoft(MOCK.find((obj: any) => obj.id === softId));
    }, [loading, error]);

    return (
        <div className="wrapper clear">
            <LoadingPopUp
                show={loadingShown}
                error={error}
                onClose={handleClose}
                message={'Открывается...'}
            />
            <Header />
            <SiteNavbar />
            <CurrentPath
                links={[
                    ['Главная', '/info'],
                    ['Каталог', '/catalog'],
                    [soft.name, '']
                ]}
            />

            <ul className="content p-15 flex-row">
                {loadingShown ? (
                    <h2>...</h2>
                ) : (
                    <>
                        <h2 className="mb-0 d-flex flex-column flex-sm-row justify-between sm text-center">
                            {soft.name}
                        </h2>
                        <div className="text-center">
                            <img
                                className="wrapper align-center mt-25 mb-20 w-75"
                                src={
                                    soft.image
                                        ? soft.image
                                        : '/src/card_img_placeholder.jpg'
                                }
                                onError={(e) => imgPlaceholder(e)}
                            />
                            <h3>Цена: {soft.price} ₽</h3>
                        </div>

                        <h3>Описание:</h3>
                        <li className="mb-25 ml-25">{soft.description}</li>
                        <h3 className="mb-0">Файлы:</h3>
                        <div className="w-100 text-center">
                            <div className="mt-15 d-inline-block">
                                {!(
                                    soft.files &&
                                    soft.files.length
                                ) ? (
                                    <h2>...</h2>
                                ) : (
                                    soft.files.map((file: any) => (
                                        <FileCard file={file} />
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </ul>
        </div>
    );
};


export default Soft;
