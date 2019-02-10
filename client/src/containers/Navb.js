import React from 'react';
import { Navbar, Nav, NavDropdown, } from 'react-bootstrap';
import { IconButton, Badge } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';

const NavBar = () => <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
        </Nav>
        <Nav>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
                Dank memes
    </Nav.Link>
        </Nav>
    </Navbar.Collapse>
</Navbar>;
/* 
const NavBar = () =>
    <Navbar inverse collapseOnSelect>
        <Navbar.Header>
            <Navbar.Brand><a href="/">Trip Poll</a></Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavItem eventKey={1} href="/propose">Propose a Trip</NavItem>
                <NavItem eventKey={2} href="/view">View a Trip</NavItem>
                <NavDropdown eventKey={3} title="Trips" id="basic-nav-dropdown">
                    <MenuItem eventKey={3.1} href="/trips">My Trips</MenuItem>
                    <MenuItem eventKey={3.2} href="/places">Friend's Trips</MenuItem>
                    <MenuItem eventKey={3.3} href="/updates">Trip Updates</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={3.3} href="/info">Information</MenuItem>
                </NavDropdown>
            </Nav>
            <Nav pullRight>
                <NavDropdown eventKey={3} title="Notifications" id="basic-nav-dropdown">
                    <UsersTab />
                </NavDropdown>
                <NavItem eventKey={1} href="/contact">Contact</NavItem>
                <NavItem eventKey={2} href="/login">Login</NavItem>
                <NavItem><img src="" /></NavItem>
                 <NavItem eventKey={2} href="/login">
                    <Badge badgeContent={4} color="secondary">
                        <MailIcon />
                    </Badge>
                </NavItem>
                <NavItem eventKey={2} href="/login">
                    <Badge badgeContent={17} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </NavItem>
                <NavItem eventKey={2} href="/login">
                    <AccountCircle />
                </NavItem> 
            </Nav>
        </Navbar.Collapse>
    </Navbar>
 */
export default NavBar;