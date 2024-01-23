import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


const AddNewFilePopUp = ({ onClose, addFile}) => {
    const [formData, setFormData] = useState({ // Did like that to easier serialize to multipart form
        file: '',
        platform: 'Windows',
        architecture: 'x64',
        // comment: '',

    });
    const {file, platform, architecture, comment} = formData;
    const [applyShown, setApplyShown] = useState(false);

    const changeForm = e => {
        setFormData({
            ...formData, [e.target.name]: e.target.files ? e.target.files[0] : e.target.value
        });
    }

    useEffect(() => setApplyShown(
        Object.values(formData).every(value => !!value)
    ), [formData])

    return (
        <Modal show={true} centered>
            <Modal.Body>
                <Button
                    variant="danger"
                    className="position-relative float-end top-0"
                    onClick={onClose}>
                    &times;
                </Button>
                <form className="container flex-wrap">
                    <div className='form-group mt-30'>
                        <label className='form-label'>Загрузочный файл:</label>
                        <input
                            className='form-control'
                            type='file'
                            name='file'
                            onChange={changeForm}
                            required
                        />
                    </div>
                    <div className='form-group mt-25'>
                        <label className='form-label'>Платформа:</label>
                        <select
                            className="form-control"
                            name='platform'
                            onChange={changeForm}
                            value={platform}>
                            <option value="Windows">Windows</option>
                            <option value="Linux">Linux</option>
                            <option value="MacOS">MacOS</option>
                            required
                        </select>
                    </div>
                    <div className='form-group mt-25'>
                        <label className='form-label'>Архитектура:</label>
                        <select
                            className="form-control"
                            name='architecture'
                            onChange={changeForm}

                            value={architecture}>
                            <option value="x32">x32</option>
                            <option value="x64">x64</option>
                            required
                        </select>
                    </div>
                    {/*<div className='form-group mt-25'>*/}
                    {/*    <label className='form-label'>Пометка</label>*/}
                    {/*    <input*/}
                    {/*        className='form-control'*/}
                    {/*        type='text'*/}
                    {/*        name='comment'*/}
                    {/*        onChange={changeForm}*/}
                    {/*        value={comment}*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="mt-35 d-flex justify-content-center ">
                        {applyShown ?
                            <Button className="w-25 ml-25" variant='success' onClick={() => addFile(formData)}>
                                Добавить
                            </Button> : ''}
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );

};

export default AddNewFilePopUp;