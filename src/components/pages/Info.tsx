import React, { FC } from "react";
import { Link } from "react-router-dom";
import Header from "../parts_share/Header";
import SiteNavbar from "../parts_share/SiteNavbar";


const Info: FC = () => {

    return (
        <div className="wrapper clear">
            <Header />
            <SiteNavbar />
            <h1 className="display-4 m-20">Магазин программного обеспечения</h1>
            <p className='lead ml-10'>Проект Павлова Сергея Дениосвича, РТ5-51Б</p>
            <p className='lead ml-10'>Есть чем удивить</p>
            <hr className='my-4'/>
            <div className="container">
                <div className="justify-content-center row">
                    <div className="col-8 col-sm-7 col-md-6">
                        <div className="m-10 card ">
                            <div className="card-body d-flex flex-column ">
                                <Link className='btn btn-primary btn' to='/catalog'>Каталог</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Info;
