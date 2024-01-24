import React, { FC } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';


const SiteNavbar: FC = () => {
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
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default SiteNavbar;
