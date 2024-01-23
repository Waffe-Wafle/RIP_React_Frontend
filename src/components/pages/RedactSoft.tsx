import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
    addSoft,
    deleteSoftById,
    setCurrentSoft,
    useCurrentSoft,
    useStoredSoft,
    setRefreshView,
} from '../../redux/dataSlice';
import Header from '../parts_share/Header';
import SiteNavbar from '../parts_share/SiteNavbar';
import CurrentPath from '../parts/CurrentPath';
import { SoftAPI } from '../../api';
import useFetch from '../../hooks_and_utils/useFetch';
import LoadingPopUp from '../popups/LoadingPopUp';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import ConfirmationPopUp from '../popups/ConfirmationPopUp';
import { useDispatch } from 'react-redux';
import FileCard from '../parts/FileCard';
import AddNewFilePopUp from '../popups/AddNewFilePopUp';

interface FormData {
    name: string;
    image: File | string;
    description: string;
    price: string;
}

const RedactSoft: React.FC = () => {
    const { soft_id: softId } = useParams();
    const cur = useCurrentSoft(); // Should be used unconditionally..

    const storedCurrent = softId ? cur : { files: [] };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loadingShown, setLoadingShown] = useState(false);
    const [fileAdditionShown, setFileAdditionShown] = useState(false);
    const [confirmationShown, setConfirmationShown] = useState(false);

    // For soft:
    const [formData, setFormData] = useState<FormData>({
        name: storedCurrent.name || '',
        image: '',
        description: storedCurrent.description || '',
        price: storedCurrent.price || '',
    });
    const { name, image, description, price } = formData;

    const changeForm = e =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.files ? (e.target.files[0] as File) : e.target.value
        });

    // For files:
    const [files, setFiles] = useState(storedCurrent.files);
    const [processedFile, setProcessedFile] = useState({} as any); // Should be always {} where unset!

    // For sending:
    const [serialisedForm, setSerialisedForm] = useState<FormData>();
    const [isDeleteReq, setIsDeleteReq] = useState<boolean>();
    const [isSoftReq, setIsSoftReq] = useState<boolean>(); // To understand which api use

    const serialiseForm = (data: FormData, form: FormData) => {
        Object.entries(data).map(([name, value]) => {
            //@ts-ignore
            if (value) form.append(name, value);
        });
        return form;
    };

    useEffect(()=> {
        if(!softId) {
            //@ts-ignore
            setFormData({name:'', image:'', description:'', price: ''});
            setFiles([]);
            console.log('tried')
        }

    }, [softId])

    // Fetch (add new or update soft, add or delete file) logic:
    const staticParts = {
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        data: isDeleteReq ? '' : serialisedForm,
    };

    const softCallback = (data: any) => {
        dispatch(setCurrentSoft(data));
        if (isDeleteReq) {
            dispatch(deleteSoftById(data.id));
            navigate('/catalog');
        } else {
            dispatch(addSoft(data));
            navigate(`/update_soft/${data.id}`);
        }
        dispatch(setRefreshView(false));
        dispatch(setRefreshView(true));
        setLoadingShown(false);
    };

    const { data: softData, loading: softLoading, error: softError, doFetch: softDoFetch } = useFetch(
        SoftAPI + 'softs/' + (softId ? softId + '/' : ''),
        {
            method: softId ? (isDeleteReq ? 'DELETE' : 'PUT') : 'POST',
            ...staticParts,
        },
        softCallback
    );

    const filesCallback = (data: any) => {
        if (isDeleteReq) setFiles((prev) => prev.filter((item) => item.id !== processedFile.id));
        else setFiles((prev) => [...prev, data]);
        dispatch(
            setCurrentSoft({
                ...storedCurrent,
                files: files,
            })
        );
        setLoadingShown(false);
    };

    const { data: filesData, loading: filesLoading, error: filesError, doFetch: filesDoFetch } = useFetch(
        SoftAPI + 'files/' + (isDeleteReq ? processedFile.id : ''),
        {
            method: isDeleteReq ? 'DELETE' : 'POST',
            ...staticParts,
        },
        filesCallback
    );

    // Actions logic:
    const handleAction = (isSoftReq: boolean, isDeleteReq: boolean, file: any = {}) => {
        setIsSoftReq(isSoftReq);
        setIsDeleteReq(isDeleteReq);
        setProcessedFile({ ...file, soft: softId });
        setConfirmationShown(true);
    };

    const handleConfirmAction = (isConfirmed: boolean) => {
        setConfirmationShown(false);
        if (isConfirmed) {
            if (!isDeleteReq)
                //@ts-ignore
                setSerialisedForm(serialiseForm(isSoftReq ? (formData as FormData) : processedFile, new FormData()));
            if (isSoftReq) softDoFetch();
            else {
                setFileAdditionShown(false);
                filesDoFetch();
            }
        }
    };

    // Showing loading logic:
    useEffect(() => {
        if (softLoading || filesLoading || softError || filesError) setLoadingShown(true);
    }, [softLoading, filesLoading, softError, filesError]);
    const handleClose = () => {
        if (!(softLoading || filesLoading)) setLoadingShown(false);
    };

    // Showing adding file:
    // @ts-ignore
    return (
        <div className="wrapper clear">
            <LoadingPopUp
                show={loadingShown}
                error={softError ? softError : filesError}
                onClose={handleClose}
                message={'Производится операция...'}
            />

            {fileAdditionShown ? (
                <AddNewFilePopUp
                    onClose={() => setFileAdditionShown(false)}
                    addFile={(file) => handleAction(false, false, file)}
                />
            ) : (
                ''
            )}

            <ConfirmationPopUp
                show={confirmationShown}
                title="Подтвердить?"
                //@ts-ignore
                message={{ confirm: 'Да', reject: 'Нет' }}
                result={handleConfirmAction}
            />

            <Header />
            <SiteNavbar />
            <CurrentPath
                links={[
                    ['Главная', '/info'],
                    ['Каталог', '/catalog'],
                    [storedCurrent.name, `/soft/${storedCurrent.id}`],
                    //@ts-ignore
                    [(softId ? 'Редактировать' : 'Добавить')],
                ]}
            />
            <form className="p-25 pt-0" onSubmit={changeForm}>
                <div className="form-group mt-25">
                    <label className="form-label">Название:</label>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={changeForm}
                        value={formData.name}
                        required
                    />
                </div>
                <div className="form-group mt-25">
                    <label className="form-label">Изображение:</label>
                    <input
                        className="form-control"
                        type="file"
                        name="image"
                        onChange={changeForm}
                        // value={image}
                        required
                    />
                </div>
                <div className="form-group mt-25">
                    <label className="form-label">Описание:</label>
                    <input
                        className="form-control"
                        type="text"
                        name="description"
                        onChange={changeForm}
                        value={formData.description}
                        required
                    />
                </div>
                <div className="form-group mt-25">
                    <label className="form-label">Цена:</label>
                    <input
                        className="form-control"
                        type="text"
                        name="price"
                        onChange={changeForm}
                        value={price}
                        required
                    />
                </div>
                <div className="mt-25 d-flex justify-content-center gap-5 ">
                    <Button
                        className="col-sm-3  "
                        variant="success"
                        onClick={() => handleAction(true, false)}
                    >
                        {softId ? 'Изменить' : 'Добавить'}
                    </Button>

                    {softId ? (
                        <Button
                            className="col-sm-3  "
                            variant="danger"
                            onClick={() => handleAction(true, true)}
                        >
                            Удалить
                        </Button>
                    ) : (
                        ''
                    )}
                </div>

                <div className="w-100 text-center">
                    <div className="mt-15 d-inline-block">
                        {!files.length ? (
                            <h2>...</h2>
                        ) : (
                            files.map((file) => (
                                <FileCard
                                    file={file}
                                    deleteEnabled={true}
                                    saveEnabled={true}
                                    handleDelete={() => handleAction(false, true, file)}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-15 d-flex  justify-content-center ">
                    {!softId ? '' : (
                        <Button className="col-sm-3 " onClick={() => setFileAdditionShown(true)}>
                            Добавить файл
                        </Button>
                    )}
                </div>
                <div className="mt-15 d-flex  justify-content-center ">
                    {!softId ? '' : <Button className="col-sm-4 " href={'#/new_soft'}>
                        Добавить программу
                    </Button>
                    }
                </div>
            </form>
        </div>
    );
};

export default RedactSoft;
