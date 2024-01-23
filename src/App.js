import {HashRouter, Route, Routes, Navigate} from "react-router-dom";
import useSetCSRFCookie from "./hooks_and_utils/useSetCSRFCookie";
import Catalog from "./components/pages/Catalog";
import Soft from "./components/pages/Soft";
import Info from "./components/pages/Info";



const App = () => {
    useSetCSRFCookie();
    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route exact path='/'                element={<Navigate to="/catalog" />}/>
                    <Route exact path="/catalog"        element={<Catalog/>}/>
                    <Route exact path="/soft/:soft_id"  element={<Soft/>}/>
                    <Route exact path="/info"           element={<Info/>}/>
                </Routes>
            </HashRouter>
        </div>
    );
}


export default App;