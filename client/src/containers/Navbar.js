import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, } from 'react-bootstrap';

const NavBarComponent = (props) => {
    //console.log(props);
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <div className="container" >
                <Link className="navbar-brand" to="/">
                    <img src="./logo1.jpg" alt="logo" style={{ width: "25px", height: '25px', marginRight: '10px' }}></img>
                    Trip Poll
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        {props.status ?
                            <React.Fragment>
                                <Link className="nav-link" to="/propose">Propose</Link>
                                <Link className="nav-link" to="/view">View</Link>
                                {/* <NavDropdown title="Trips" id="collasible-nav-dropdown">
                                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                </NavDropdown> */}</React.Fragment> : <div></div>}
                    </Nav>
                    <Nav>
                        {props.status ? <Link className="nav-link" to="/logout">Logout</Link> : <Link className="nav-link" to="/login">Login</Link>}
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>)
}

export default NavBarComponent;