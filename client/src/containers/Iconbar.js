import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, } from 'react-bootstrap';

const Iconbar = (props) => {
    //console.log(props);
    return (
        <Navbar className="mobile-nav-show" fixed="bottom" collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ padding: "2px 45px", borderRadius: '8px', visibility: "hidden" }}>
            <div className="container"  >
                <Nav><Link className="nav-link" to="/">
                    <button className="btn btn-light" style={{ padding: 0 }}> <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '10px' }}>
                        <img src="./home.png" alt="logo" style={{ width: "25px", height: '25px' }}></img>

                    </div></button>
                </Link></Nav>
                {props.status ?
                    <React.Fragment>
                        <Nav><Link className="nav-link" to="/propose">
                            <button className="btn btn-light" style={{ padding: 0 }}>  <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '10px' }}>
                                <img src="./propose.png" alt="logo" style={{ width: "25px", height: '25px' }}></img>
                            </div></button>
                        </Link></Nav>
                        <Nav><Link className="nav-link" to="/view">
                            <button className="btn btn-light" style={{ padding: 0 }}> <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '10px' }}>
                                <img src="./view.png" alt="logo" style={{ width: "25px", height: '25px' }}></img>
                            </div></button>
                        </Link></Nav>
                    </React.Fragment>
                    : <div></div>}

                <Nav>
                    {props.status ? <Link className="nav-link" to="/logout">
                        <button className="btn btn-light" style={{ padding: 0 }}><div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '10px' }}>
                            <img src="./logout.png" alt="logo" style={{ width: "25px", height: '25px' }}></img>
                        </div></button>
                    </Link> : <Link className="nav-link" to="/login">
                            <button className="btn btn-light" style={{ padding: 0 }}> <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '10px' }}>
                                <img src="./login.png" alt="logo" style={{ width: "25px", height: '25px' }}></img>
                            </div></button>
                        </Link>}
                </Nav>
            </div>
        </Navbar>)
}

export default Iconbar;