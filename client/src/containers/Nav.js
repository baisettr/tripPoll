import React from 'react';

const NavBar = () =>

    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
        <div className="container" >
            <a className="navbar-brand" href="/">Trip Poll</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/propose">Propose a Trip</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/view">View a Trip</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Trips
                </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="/myTrips">My Trips</a>
                            <a className="dropdown-item" href="/sharedTrips">Shared Trips</a>
                            <div className="dropdown-divider" />
                            <a className="dropdown-item" href="/tripsSummary">My Summary</a>
                        </div>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/contact">Contact Us</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/login">Login</a>
                    </li>
                </ul>

            </div>
        </div>
    </nav>
export default NavBar;