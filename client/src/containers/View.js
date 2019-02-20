import React, { Component } from 'react';
import axios from 'axios';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { withRouter, Link } from 'react-router-dom';
import {
    FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton,
    EmailIcon, WhatsappIcon, TwitterIcon, FacebookIcon
} from 'react-share';

const styles = {
    divHome: {
        backgroundColor: "rgba(255, 255, 255)",
        textAlign: 'center',
        marginTop: '15px'
    }
}

class View extends Component {
    constructor(props) {
        super(props);
        const tripId = props.location.search.split('=')[1];
        this.state = { error: "", user: {}, tripId: tripId, finalTrip: {}, activeStep: 0, destination: "", tripSelectionUrl: "https://rkbeavs.me/trpo/select?tripId=", selectedAirbnbPlaces: [], selectedGooglePlaces: [], listAirbnbPlaces: [], listGooglePlaces: [] };
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const queryParams = {};
        for (let param of query.entries()) {
            queryParams[param[0]] = param[1];
        }
        const tripId = queryParams["tripId"];
        if (tripId) {
            const tripSelectionUrl = this.state.tripSelectionUrl + tripId;
            this.setState({ tripId, tripSelectionUrl, activeStep: 3 });
            this.getTripDetails(tripId);
        }
    }

    getTripDetails = (tripId) => {
        const url = '/trip?tripId=' + tripId;
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        axios.get(url, { headers }
        ).then((res) => {
            const trip = res.data;
            console.log(trip);
            if (trip.finalTrip) {
                const { tripOwner, finalTrip, tripDestination, tripListGooglePlaces, tripListAirbnbPlaces } = trip;
                let selectedGooglePlaces = [];
                for (const i in tripListGooglePlaces) {
                    const place = tripListGooglePlaces[i];
                    if (finalTrip.selectedGooglePlaces[place.id] === 1) {
                        selectedGooglePlaces.push(place);
                    }
                };
                let selectedAirbnbPlaces = [];
                for (const i in tripListAirbnbPlaces) {
                    const room = tripListAirbnbPlaces[i];
                    if (finalTrip.selectedAirbnbPlaces[room.id] === 1) {
                        selectedAirbnbPlaces.push(room);
                    }
                };

                this.setState({ activeStep: 1, user: tripOwner, destination: tripDestination, listGooglePlaces: tripListGooglePlaces, listAirbnbPlaces: tripListAirbnbPlaces, selectedAirbnbPlaces, selectedGooglePlaces, finalTrip });
            } else { this.setState({ activeStep: 2 }); }
        }).catch((error) => {
            const message = error.response.data.message;
            this.setState({ error: message, activeStep: 0 })
        });
    }

    getTripDetailsFromUserInput = (e) => {
        e.preventDefault();
        this.setState({ activeStep: 3 });
        const tripId = this.state.tripId;
        const tripSelectionUrl = this.state.tripSelectionUrl + tripId;
        this.setState({ tripSelectionUrl });
        this.getTripDetails(tripId);
    }

    ViewHomeComponent = () =>
        <div>
            <h4>Enter the Trip Id associated with the trip</h4>
            <br />
            <h6 style={{ color: 'red' }}>{this.state.error}</h6>
            <form onSubmit={this.getTripDetailsFromUserInput}>
                <input className="inputPlace form-control" type="number" name="tripId" defaultValue={this.state.tripId} onChange={(e) => { this.setState({ tripId: e.target.value, error: "" }) }} placeholder="Trip Id" required={true} />
                <br />
                <button className="btn btn-dark">Fetch Details</button>
            </form>
        </div>

    googlePlaceSearchHandler = (place, e) => {
        e.preventDefault();
        const url = 'https://google.com/search?q=' + place + ', ' + this.state.destination;
        window.open(url, '_blank', 'height=500,width=1400');
    }

    GooglePlacesComponent = () =>
        <div>
            <br />
            <h6>Tourist attractions!</h6>
            <br />
            <div className="grid-container">
                {this.state.selectedGooglePlaces.map((place, index) => (
                    <div id="googleGrid" className="card grid-item" key={index} >
                        <h6>{place.name} {' '}
                            <a style={{ fontSize: '13px' }} className="btn-link" href='/#' onClick={this.googlePlaceSearchHandler.bind(this, place.name)}>More...</a>
                        </h6>
                    </div>
                ))}
            </div>
        </div>

    airbnbRoomSearchHandler = (roomId, e) => {
        e.preventDefault();
        const url = 'https://www.airbnb.com/rooms/' + roomId + '?guests=1&adults=1';
        window.open(url, '_blank', 'height=500,width=1400');
    }

    AirbnbPlacesComponent = () =>
        <div>
            <br />
            <h6>Airbnb accomodations!</h6>
            <br />
            <div className="grid-container">
                {this.state.selectedAirbnbPlaces.map((lis, index) => (
                    <div id="airbnbGrid" className="card grid-item" key={index} >
                        <img className="card-img-top" src={lis.thumb} alt="" />
                        <h6 >{lis.name} </h6>
                        <h6>${lis.price} per night{' '}
                            <a style={{ fontSize: '13px' }} className="btn-link" href='/#' onClick={this.airbnbRoomSearchHandler.bind(this, lis.id)}>More...</a>
                        </h6>
                    </div>
                ))}
            </div>
        </div>


    ShareAndCarComponent = () =>
        <div>
            <h6>Trip Share and Car Details</h6>
            <br />
            <label style={{ paddingRight: '10px' }}>Total share for the Trip (in $) - {this.state.finalTrip.userOtherOptions.userShare}</label>
            <br />
            <label style={{ paddingRight: '10px' }}>Going trip via Car - {this.state.finalTrip.userOtherOptions.userHasCar}</label>
            <br />
            <label style={{ paddingRight: '10px' }}>Total number of people can drive through Car - {this.state.finalTrip.userOtherOptions.userCarFit}</label>
        </div>

    TripHomeComponent = () =>
        <div>
            <h6>Trip Details</h6>
            <br />
            <div>
                <label>Destination : {this.state.destination}</label>
            </div>
            <div>
                <label>Trip Owner : {this.state.user.userName} </label>
                <br />
                <label>Other Listed Trip Friends </label>
                {this.state.finalTrip.users.map((u, index) => <h6 key={index}>{u}</h6>)}
            </div>
        </div>
    DateComponent = () => <div >
        <h6>Trip Dates</h6>
        <DayPicker month={new Date(this.state.finalTrip.selectedDays[0])} selectedDays={this.state.finalTrip.selectedDays.map((day) => new Date(day))} />
    </div>

    DisplayLinks = () =>
        <div >
            <div style={{ display: "inline-flex" }}>
                <div className="btn">
                    <FacebookShareButton className="btn" url={this.state.tripSelectionUrl} quote={"Please select trip options for " + this.state.destination} >
                        <FacebookIcon size={40} round={true} />
                    </FacebookShareButton>
                    <h6>Facebook</h6>
                </div>
                <div className="btn">
                    <TwitterShareButton className="btn" hashtags={['trip poll']} title={"Please select trip options for " + this.state.destination} url={this.state.tripSelectionUrl} >
                        <TwitterIcon size={40} round={true} />
                    </TwitterShareButton>
                    <h6>Twitter</h6>
                </div>
                <div className="btn">
                    <EmailShareButton className="btn" url={this.state.tripSelectionUrl} subject={"Please select trip options for " + this.state.destination} body={"Hello\n\nWelcome to Trip Poll!\nPlease follow the link to select options\n" + this.state.tripSelectionUrl + "\n\nThank You\n" + this.state.user.userName}>
                        <EmailIcon size={40} round={true} />
                    </EmailShareButton>
                    <h6>Email</h6>
                </div>
                <div className="btn">
                    <WhatsappShareButton className="btn" url={this.state.tripSelectionUrl} title={"Please select trip options for " + this.state.destination}>
                        <WhatsappIcon size={40} round={true} />
                    </WhatsappShareButton>
                    <h6>WhatsApp</h6>
                </div>
            </div>
            <br /><br /><br />
            <div style={{ display: "inline-flex" }}>
                <input id="tripSelectionUrl" className="form-control inputPlace" defaultValue={this.state.tripSelectionUrl} readOnly />
                <button className="btn btn-dark" onClick={this.CopyLinkSelect}> Copy Link</button>
            </div>
        </div>

    CopyLinkSelect = () => {
        const tripSelectionUrl = document.getElementById('tripSelectionUrl');
        tripSelectionUrl.select();
        document.execCommand("copy");
    }

    DisplayLinksComponent = () =>
        <div>
            <h4>Trip has not yet finalized!</h4>
            <br /><br />
            <this.DisplayLinks />
        </div>

    DisplayTripDetails = () =>
        <div>
            <div className="grid-container-view">
                <this.TripHomeComponent />
                <this.DateComponent />
                <this.ShareAndCarComponent />
            </div>
            <this.GooglePlacesComponent />
            <this.AirbnbPlacesComponent />
        </div>

    SpinComponent = () => <div className='Loader'>Loading...</div>

    switchComponent = (e) => {
        switch (e) {
            case 0: return <this.ViewHomeComponent />
            case 1: return <this.DisplayTripDetails />
            case 2: return <this.DisplayLinksComponent />
            case 3: return <this.SpinComponent />
            default: return <h4>Please <Link to="/login" >Login</Link></h4>
        }
    }

    render() {
        return (
            <div className="jumbotron container" style={styles.divHome}>
                <div>
                    {this.switchComponent(this.state.activeStep)}
                </div>
                <br /><br />
                <h6>Proceed to <Link to="/">Home</Link></h6>
            </div>
        );
    }
}

export default withRouter(View);