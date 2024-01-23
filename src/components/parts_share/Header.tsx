import React from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks_and_utils/useFetch.js';
import { ProfilesAPI } from '../../api';
import {
    setIsAuthenticated,
    setIsStaff,
    clearBasket,
    clearPayments,
    useIsAuthenticated,
    setCurrentSoft,
    setDraftId,
} from '../../redux/dataSlice';


interface HeaderProps {
    authWiev?: boolean;
}


const Header: React.FC<HeaderProps> = ({ authWiev = false }) => {
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, loading, error, doFetch } = useFetch(
        `${ProfilesAPI}logout/`,
        //@ts-ignore
        { method: 'GET' },
        null // We should do log out even if the server is unavailable
    );

    const handleLogout = () => {
        doFetch();
        dispatch(setIsAuthenticated(false));
        dispatch(setIsStaff(false));
        dispatch(clearPayments());
        dispatch(clearBasket());
        dispatch(setCurrentSoft(null));
        dispatch(setDraftId(null));
        if (['#/basket', '#/my_payments', '#/update_soft', '#/manage'].includes(window.location.hash))
            navigate('/');

        localStorage.clear();
    };

    return (
        <header className="d-flex justify-between align-center p-35 clear">
            <div className="d-flex align-center">
                <img width={100} height={100} src={process.env.PUBLIC_URL + '/src/header_logo.png'} alt="Logo" />
                <div>
                    <h3 className="text-uppercase d-none d-sm-flex">Магазин программ</h3>
                </div>
            </div>
            {authWiev ? (
                ''
            ) : (
                <div
                    className="d-flex justify-between align-center register"
                    onClick={() => (isAuthenticated ? handleLogout() : navigate('/login'))}
                >
                    <img width={20} height={20} src={process.env.PUBLIC_URL + '/src/user_profile.png'} alt="User Profile" />
                    <span>{isAuthenticated ? 'Выйти' : 'Войти'} </span>
                </div>
            )}
        </header>
    );
};


export default Header;
