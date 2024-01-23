import {HashRouter, Route, Routes, Navigate} from "react-router-dom";
import useSetCSRFCookie from "./hooks_and_utils/useSetCSRFCookie";
import Catalog from "./components/pages/Catalog";
import Soft from "./components/pages/Soft";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Basket from "./components/pages/Basket";
import Payments from "./components/pages/Payments";
import Info from "./components/pages/Info";
import RedactSoft from "./components/pages/RedactSoft";
import RequestsManaging from "./components/pages/RequestsManaging";



const App = () => {
    useSetCSRFCookie();
    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route exact path='/'                element={<Navigate to="/catalog" />}/>
                    <Route exact path="/catalog"        element={<Catalog/>}/>
                    <Route exact path="/soft/:soft_id"  element={<Soft/>}/>

                    <Route exact path="/register"       element={<Register/>}/>
                    <Route exact path='/login'          element={<Login/>}/>

                    <Route exact path="/basket"         element={<Basket fetchBrake={true}/>}/>
                    <Route exact path='/my_payments'    element={<Payments/>}/>

                    <Route exact path='/new_soft'       element={<RedactSoft/>}/>
                    <Route exact path='/update_soft/:soft_id' element={<RedactSoft/>}/>
                    <Route exact path='/manage'         element={<RequestsManaging/>}/>

                    <Route exact path="/info"           element={<Info/>}/>
                </Routes>
            </HashRouter>
        </div>
    );
}


export default App;