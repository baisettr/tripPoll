import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const styles = {
    divHome: {
        backgroundColor: "rgba(255, 255, 255)",
        textAlign: 'center',
        marginTop: '15px'
    }
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { actionStep: 0, myTrips: [], friendTrips: [] }
    }

    myTripsClickHandler = (e) => {
        e.preventDefault();

        const url = '/myTrips';
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        axios.get(url, { headers }
        ).then((res) => {
            //console.log(res.data)
            this.setState({ actionStep: 1, myTrips: res.data });
        }).catch((error) => {
            console.log(error);
        });
    }

    friendsTripsClickHandler = (e) => {
        e.preventDefault();

        const url = '/myTrips';
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        axios.get(url, { headers }
        ).then((res) => {
            console.log(res.data)
            this.setState({ actionStep: 2, myTrips: res.data });
        }).catch((error) => {
            console.log(error);
        });

    }

    HomeClickHandler = (e) => {
        e.preventDefault();
        this.setState({ actionStep: 0 });
    }
    DashboardComponent = () =>
        <div>
            <h4>Welcome to Trip Poll - Plan before you ride!</h4>
            <br />
            <div className="grid-container">
                <div className="card grid-item">
                    <div className="card-title">My Trips</div>
                    <div className="card-body">
                        <h6>Plan a new trip {' '}
                            <Link className="btn-link" to="/propose">Propose a Trip</Link>
                        </h6>
                        <h6>Your planned trips {' '}
                            <a className="btn-link" href="/#" onClick={this.myTripsClickHandler.bind(this)}>My Trips</a>
                        </h6>
                        <h6>Check a trip status {' '}
                            <Link className="btn-link" to="/view">View a Trip</Link>
                        </h6>
                    </div>
                </div>
                <div className="card grid-item">
                    <div className="card-title">My Responses</div>
                    <div className="card-body">
                        <h6>Check your responses for friend's trips {' '}
                            <a className="btn-link" href="/#" onClick={this.friendsTripsClickHandler.bind(this)}>My Responses</a>
                        </h6>
                    </div>
                </div>
                <div className="card grid-item">
                    <div className="card-title">My Summary</div>
                    <div className="card-body">
                        <h6>Check your recent trip{' '}
                            <a className="btn-link" href="/recentTrip">Recent Trip</a>
                        </h6>
                        <h6>Check your overall trips summary {' '}
                            <a className="btn-link" href="/summary">Trips in all</a>
                        </h6>
                    </div>
                </div>
            </div>
        </div>

    selectTripClickHandler = (tripId) => {
        const url = '/select?tripId=' + tripId;
        this.props.history.push(url);
    }

    viewTripClickHandler = (tripId) => {
        const url = '/view?tripId=' + tripId;
        this.props.history.push(url);
    }

    MyTripsComponent = () =>
        <div className="jumbotron container" style={styles.divHome}>
            <h4>My Trips</h4>

            <div className="grid-container-home">
                {this.state.myTrips.map((trip, index) => (
                    <div className="grid-item-home" key={index}>
                        <div style={{ display: 'inline-block' }} className="d-flex justify-content-between">
                            <h6 style={{ display: 'inline-block' }}>{trip.tripId} - {trip.tripDestination}</h6>
                            <div style={{ display: 'inline-block' }} >
                                <button className="btn btn-light" onClick={this.viewTripClickHandler.bind(this, trip.tripId)}>View</button> | {' '}
                                <button className="btn btn-dark" >Finalize</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <br />
            <h6>Proceed to <a href="/#" onClick={this.HomeClickHandler.bind(this)}>Home</a></h6>
        </div>

    FriendsTripsComponent = () =>
        <div className="jumbotron container" style={styles.divHome}>
            <h4>Friend's Trips</h4>

            <div className="grid-container-home">
                {this.state.myTrips.map((trip, index) => (
                    <div className="grid-item-home" key={index}>
                        <div style={{ display: 'inline-block' }} className="d-flex justify-content-between">
                            <h6 style={{ display: 'inline-block' }}>{trip.tripId} - {trip.tripDestination}</h6>
                            <div style={{ display: 'inline-block' }} >
                                <button className="btn btn-light" onClick={this.viewTripClickHandler.bind(this, trip.tripId)}>View Final Trip</button> | {' '}
                                <button className="btn btn-dark" onClick={this.selectTripClickHandler.bind(this, trip.tripId)}>Select Options</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <br />
            <h6>Proceed to <a href="/#" onClick={this.HomeClickHandler.bind(this)}>Home</a></h6>
        </div>

    switchComponent = (e) => {
        switch (e) {
            case 0: return ""
            case 1: return <this.MyTripsComponent />
            case 2: return <this.FriendsTripsComponent />
            default: return <h4>Please <a href="/login">Login</a> Have a Nice Day!</h4>
        }
    }

    render() {
        return (
            <div>
                <div className="jumbotron container" style={styles.divHome}>
                    <this.DashboardComponent />
                </div>
                <div >
                    {this.switchComponent(this.state.actionStep)}
                </div>
            </div>
        );
    }
}

export default Home;