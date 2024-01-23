import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SiteNavbar from '../parts_share/SiteNavbar';
import Button from 'react-bootstrap/Button';
import useFetch from '../../hooks_and_utils/useFetch.js';
import { ProfilesAPI } from '../../api';
import { setIsAuthenticated, setIsStaff } from '../../redux/dataSlice';
import LoadingPopUp from '../popups/LoadingPopUp';
import MessagePopUp from '../popups/MessagePopUp';
import Header from '../parts_share/Header';

const Register: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false); // To understand msg type
    const [popupError, setPopupError] = useState<string | null>(null); // Costil
    const [messageShown, setMessageShown] = useState<boolean>(false);
    const [loadingShown, setLoadingShown] = useState<boolean>(false);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');

    // Fetch and submit logic:
    const handleRegistered = (data) => {
        // Should be there... Rules are rules
        navigate('/catalog');
        dispatch(setIsAuthenticated(true));
        dispatch(setIsStaff(data.is_staff));
        console.log(`user logged in`, data.is_staff);
    };

    const { data, loading, error, doFetch } = useFetch(
        ProfilesAPI + 'register/',
        //@ts-ignore
        { data: { username, password } },
        handleRegistered
    );

    const handleRegister = () => {
        if (password === rePassword) {
            setPasswordMismatch(false);
        } else {
            setPasswordMismatch(true);
            setMessageShown(true);
        }
        doFetch();
    };

    // Popups logic:
    const handleClose = () => {
        if (!loading) {
            setLoadingShown(false);
            setMessageShown(false);
        }
    };

    useEffect(() => {
        let taken = error && error.response.data.detail === 'username is already taken';
        if (taken) {
            setLoadingShown(false);
            setMessageShown(true);
        } else if (error || loading) {
            setLoadingShown(true);
            setMessageShown(false);
            setPopupError(error); // Other way the error on the previous screen can be seen (
        }
    }, [error, loading]);

    return (
        <div className="wrapper">
            <MessagePopUp
                show={messageShown}
                title={'Faild'}
                onClose={handleClose}
                message={passwordMismatch ? 'Пароли не совпадают (' : 'Это имя пользователя уже занято ('}
            />
            <LoadingPopUp show={loadingShown} error={popupError} onClose={handleClose} message={'Идет регистрация...'} />

            <Header authWiev={true} />
            <SiteNavbar />
            <div className="content p-50">
                <h1>Регистрация</h1>
                <form>
                    <div className="form-group">
                        <label className="form-label">Введите имя пользователя:</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="enter username"
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label mt-3">Введите пароль:</label>
                        <input
                            className="form-control"
                            type="password"
                            placeholder="enter password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label mt-3">Подтвердите пароль:</label>
                        <input
                            className="form-control"
                            type="password"
                            placeholder="confirm password"
                            name="re_password"
                            onChange={(e) => setRePassword(e.target.value)}
                            value={rePassword}
                            required
                        />
                    </div>
                    <Button className="btn btn-primary mt-3" onClick={handleRegister}>
                        Зарегистрироваться
                    </Button>
                </form>
                <p className="mt-3">
                    Если у вас есть аккаунт, <Link to="/login">авторизуйтесь</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
