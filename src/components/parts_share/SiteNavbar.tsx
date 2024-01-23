import React from "react";
import {useIsAuthenticated, useIsStaff} from "../../redux/dataSlice";
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

const SiteNavbar: React.FC = () => {
    const isAuthenticated: boolean = useIsAuthenticated();
    const isStaff: boolean = useIsStaff();

    return (
        <Navbar bg="light" expand="lg" className="skrug">
            <Container>
                <Navbar.Brand href="#/info">
                    <img width={30} height={30} src={process.env.PUBLIC_URL + "/src/home_button.png"} alt="Home Button" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#/info">Информация</Nav.Link>
                        <Nav.Link href="#/catalog">Каталог</Nav.Link>
                        {!isAuthenticated ? '' :
                            <NavDropdown title="Профиль" id="basic-nav-dropdown">
                                {!isStaff ? <>
                                    <NavDropdown.Item href="#/basket">Заявка</NavDropdown.Item>
                                    <NavDropdown.Item href="#/my_payments">Заказы</NavDropdown.Item>
                                </> : <>
                                    <NavDropdown.Item href="#/manage">Менеджмент заявок</NavDropdown.Item>
                                    <NavDropdown.Item href="#/new_soft">Добавить программу</NavDropdown.Item>
                                </>}
                            </NavDropdown>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default SiteNavbar;
