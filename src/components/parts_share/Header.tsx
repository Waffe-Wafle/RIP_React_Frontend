import React, { FC, useState } from 'react';

const Header: FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>();

    return (
        <header className="d-flex justify-between align-center p-35 clear">
            <div className="d-flex align-center">
                <img width={100} height={100} src={process.env.PUBLIC_URL + "/src/header_logo.png"} alt="Header Logo" />
                <div>
                    <h3 className="text-uppercase d-none d-sm-flex">Магазин программ</h3>
                    {/*<p>Вам определенно нужно что-то здесь заказать</p>*/}
                </div>
            </div>
            <div
                className="d-flex justify-between align-center register"
                onClick={() => setIsAuthenticated((prev) => !prev)}
            >
                <img width={20} height={20} src={process.env.PUBLIC_URL + "/src/user_profile.png"} alt="User Profile" />
                <span>{isAuthenticated ? 'Выйти' : 'Войти'} </span>
            </div>
        </header>
    );
};

export default Header;



//
// console.log(document.cookie)
// const options = {
//     method: 'POST',
//     withCredentials: true,
//     credentials: 'include',
//
//     headers: {
//         'Content-Type': 'application/json',
//         'X-CSRFToken': Cookies.get('csrftoken')
//     },
// };
//
//
//
//
// fetch(`http://127.0.0.1:8000/profiles_api/v1/logout/`, options)
//     .then(data => {
//         if (data.ok) {
//
//             localStorage.clear();
//             console.log('Successfully logged out');
//             navigate('/catalog');
//         }
//     })
//     .catch(err => console.error(err));


//
//
// ProfilesAPI.post('logout/', {})
//     .then(response => {
//         dispatch(setIsAuthenticatedAction(false));
//         dispatch(setIsStaffAction(false));
//         dispatch(delSumAction());
//         dispatch(delDrawAction());
//         dispatch(delPaymentSoftAction());
//         localStorage.clear();
//         console.log('Successfully logged out');
//         navigate('/catalog');
//     })
//     .catch(error => console.error('Not logged out error:', error));
