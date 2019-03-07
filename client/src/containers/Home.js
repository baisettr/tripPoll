import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';

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
        this.state = { error: "", actionStep: 0, userTrips: [], userResponses: [] }
    }

    userTripsClickHandler = (e) => {
        e.preventDefault();
        this.setState({ actionStep: 3 });
        const url = '/userTrips';
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        axios.get(url, { headers }
        ).then((res) => {
            //console.log(res.data.data)
            this.setState({ actionStep: 1, userTrips: res.data.data });
        }).catch((error) => {
            const message = error.response.data.message;
            this.setState({ error: message, actionStep: 4 });
        });
    }

    userResponsesClickHandler = (e) => {
        e.preventDefault();
        this.setState({ actionStep: 3 });
        const url = '/userResponses';
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        axios.get(url, { headers }
        ).then((res) => {
            //console.log(res.data.data)
            this.setState({ actionStep: 2, userResponses: res.data.data });
        }).catch((error) => {
            const message = error.response.data.message;
            this.setState({ error: message, actionStep: 4 });
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
                            <a className="btn-link" href="/#" onClick={this.userTripsClickHandler.bind(this)}>My Trips</a>
                        </h6>
                    </div>
                </div>
                <div className="card grid-item">
                    <div className="card-title">My Responses</div>
                    <div className="card-body">
                        <h6>Check your responses for friend's trips {' '}
                            <a className="btn-link" href="/#" onClick={this.userResponsesClickHandler.bind(this)}>My Responses</a>
                        </h6>
                    </div>
                </div>
                <div className="card grid-item">
                    <div className="card-title">My Summary</div>
                    <div className="card-body">
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

    finalizeTripClickHandler = (tripId) => {
        const url = '/final?tripId=' + tripId;
        this.props.history.push(url);
    }

    userTripsComponent = () =>
        <div className="jumbotron container" style={styles.divHome}>
            <h4>My Trips</h4>

            <div className="grid-container-home">
                {this.state.userTrips.map((trip, index) => (
                    <div className="grid-item-home" key={index}>
                        <div style={{ display: 'inline-block' }} className="justify-content-between">
                            <h6 style={{ display: 'inline-block' }}>{trip.tripId} - {trip.tripDestination} - {new Date(trip.tripPlanDate).toDateString()}</h6>
                            <div>
                                <button className="btn btn-light" style={{ display: 'inline-block' }} onClick={this.viewTripClickHandler.bind(this, trip.tripId)}>View</button> | {' '}
                                <button className="btn btn-dark" style={{ display: 'inline-block' }} onClick={this.finalizeTripClickHandler.bind(this, trip.tripId)}>Finalize</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <br />
            <h6>Proceed to <a href="/#" onClick={this.HomeClickHandler.bind(this)}>Home</a></h6>
        </div>

    userResponsesComponent = () =>
        <div className="jumbotron container" style={styles.divHome}>
            <h4>Friend's Trips</h4>

            <div className="grid-container-home">
                {this.state.userResponses.map((trip, index) => (
                    <div className="grid-item-home" key={index}>
                        <div style={{ display: 'inline-block' }} className="justify-content-between">
                            <h6 style={{ display: 'inline-block' }}>{trip.tripId} - {trip.tripDestination} - {new Date(trip.tripResponseDate).toDateString()}</h6>
                            <div>
                                <button className="btn btn-light" style={{ display: 'inline-block' }} onClick={this.viewTripClickHandler.bind(this, trip.tripId)}>View Final Trip</button> | {' '}
                                <button className="btn btn-dark" style={{ display: 'inline-block' }} onClick={this.selectTripClickHandler.bind(this, trip.tripId)}>Select Options</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <br />
            <h6>Proceed to <a href="/#" onClick={this.HomeClickHandler.bind(this)}>Home</a></h6>
        </div>

    SpinComponent = () => <div className='Loader divHome'>Loading...</div>

    ErrorMessageComponent = () => <div><h6 style={{ color: 'red', textAlign: 'center' }}>{this.state.error}</h6></div>

    switchComponent = (e) => {
        switch (e) {
            case 0: return ""
            case 1: return <this.userTripsComponent />
            case 2: return <this.userResponsesComponent />
            case 3: return <this.SpinComponent />
            case 4: return <this.ErrorMessageComponent />
            default: return <h4>Please <Link to="/login">Login</Link> Have a Nice Day!</h4>
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

export default withRouter(Home);