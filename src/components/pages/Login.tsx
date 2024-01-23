import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SiteNavbar from '../parts_share/SiteNavbar';
import Button from 'react-bootstrap/Button';
import useFetch from '../../hooks_and_utils/useFetch.js';
import { ProfilesAPI } from '../../api';
import {setIsAuthenticated, setIsStaff, setRefreshView} from '../../redux/dataSlice.js';
import LoadingPopUp from '../popups/LoadingPopUp';
import MessagePopUp from '../popups/MessagePopUp';
import Header from '../parts_share/Header';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [popupError, setPopupError] = useState<string | null>(null); // Costil (other way error on the previous PopUp can be seen)
    const [messageShown, setMessageShown] = useState<boolean>(false);
    const [loadingShown, setLoadingShown] = useState<boolean>(false);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Fetch logic:
    const handleLogged = data => {
        navigate('/catalog');
        dispatch(setIsAuthenticated(true));
        dispatch(setIsStaff(data.is_staff));
        dispatch(setRefreshView(true));
        console.log(`user logged in`, data.is_staff);
    };

    const { data, loading, error, doFetch } = useFetch(
        ProfilesAPI + 'login/',
        //@ts-ignore
        { data: { username, password } },
        handleLogged
    );

    // Popups logic:
    const handleClose = () => {
        if (!loading) {
            setLoadingShown(false);
            setMessageShown(false);
        }
    };

    useEffect(() => {
        let wrongCred = error && error.response.data.detail === 'authentication failed';
        if (wrongCred) {
            setLoadingShown(false);
            setMessageShown(true);
        } else if (error || loading) {
            setLoadingShown(true);
            setMessageShown(false);
            setPopupError(error); // Other way the error on the previous screen can be seen (
        } // data is there because of already having an error code can theoretically contain other detail message:
    }, [error, loading]);

    return (
        <div className="wrapper">
            <MessagePopUp
                show={messageShown}
                title={'Faild'}
                onClose={handleClose}
                message={'Неправильные учетные данные ('}
            />
            <LoadingPopUp
                show={loadingShown}
                error={popupError}
                onClose={handleClose}
                message={'Идет авторизация...'}
            />
            <Header authWiev={true} />
            <SiteNavbar />
            <div className="content p-50">
                <h1>Вход в аккаунт</h1>
                <form>
                    <div className="form-group">
                        <label className="form-label">Никнейм:</label>
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
                        <label className="form-label mt-3">Пароль:</label>
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
                    <Button className="btn btn-primary mt-3" onClick={doFetch}>
                        Войти
                    </Button>
                </form>
                <p className="mt-3">
                    Если у Вас нет учетной записи, <Link to="/register">зарегистрируйтесь</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
