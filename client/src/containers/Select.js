import React, { Component } from 'react';
import axios from 'axios';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import AirbnbTest from '../components/AirbnbComponent';
import GoogleTest from '../components/GoogleComponent';
import RestaurantTest from '../components/RestaurantComponent';
import { Link, withRouter } from 'react-router-dom';

const styles = {
    divHome: {
        backgroundColor: "rgba(255, 255, 255)",
        textAlign: 'center',
        marginTop: '15px'
    }
}

class Select extends Component {
    constructor(props) {
        super(props);
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        this.state = { error: '', user: { userId, userName }, tripOwner: {}, tripId: "", tripOId: '', activeStep: 0, width: 0, destination: "", userSelection: {}, tripSelectedOptions: {}, tripSelectedDays: [], selectedDays: [], listAirbnbPlaces: [], listGooglePlaces: [], listRestaurants: [], selectedRestaurants: {}, selectedGooglePlaces: {}, selectedAirbnbPlaces: {}, userOtherOptions: { userShare: 0, userHasCar: false, userCarFit: 0 } };
    }

    componentDidMount() {
        let elmnt = document.getElementById("root");
        setTimeout(() => elmnt.scrollIntoView(), 0);
        const query = new URLSearchParams(this.props.location.search);
        const queryParams = {};
        for (let param of query.entries()) {
            queryParams[param[0]] = param[1];
        }
        const tripId = queryParams["tripId"];
        if (tripId) {
            this.setState({ tripId, activeStep: 8 });
            this.getTripDetails(tripId);
        }
    }

    getTripDetails = (tripId) => {
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        const url = '/trip?tripId=' + tripId;
        axios.get(url, { headers }
        ).then((res) => {
            const trip = res.data;
            const { _id, tripOwner, tripDestination, tripSelectedDays, tripListGooglePlaces, tripListAirbnbPlaces, tripListRestaurants } = trip;
            const tripSelectedOptions = trip.tripSelectedOptions;
            const userId = this.state.user.userId;
            let userSelection = {};

            if (tripSelectedOptions[userId]) {
                userSelection = tripSelectedOptions[userId]
            } else {
                userSelection = JSON.parse(JSON.stringify(tripSelectedOptions[tripOwner.userId]));
            }
            //tripSelectedOptions[userId] ? tripSelectedOptions[userId] : tripSelectedOptions[tripOwner.userId];
            if (!tripSelectedOptions[userId]) { userSelection.userName = this.state.user.userName; userSelection.selectedDays = []; userSelection.userOtherOptions = { userShare: 0, userHasCar: false, userCarFit: 0 } }
            const { selectedGooglePlaces, selectedRestaurants, selectedAirbnbPlaces, userOtherOptions, selectedDays } = userSelection;
            this.setState({ activeStep: 1, tripOId: _id.$oid, tripOwner, destination: tripDestination, tripSelectedDays, selectedDays, selectedGooglePlaces, selectedAirbnbPlaces, userOtherOptions, listGooglePlaces: tripListGooglePlaces, listAirbnbPlaces: tripListAirbnbPlaces, selectedRestaurants, listRestaurants: tripListRestaurants, tripSelectedOptions, userSelection });
        }).catch((error) => {
            const message = error.response.data.message;
            this.setState({ error: message, activeStep: 0 })
        });
    }

    SelectHomeComponent = () =>
        <div>
            <h4>Enter the trip id associated with the trip.</h4>
            <br />
            <h6 style={{ color: 'red' }}>{this.state.error}</h6>
            <form onSubmit={this.getTripDetailsFromUserInput}>
                <input className="inputPlace form-control" type="number" name="tripId" defaultValue={this.state.tripId} onChange={(e) => { this.setState({ tripId: e.target.value, error: "" }) }} placeholder="Trip Id" required={true} />
                <br />
                <button className="btn btn-dark">Fetch Details</button>
            </form>
        </div>

    getTripDetailsFromUserInput = (e) => {
        e.preventDefault();
        this.setState({ activeStep: 8 });
        const tripId = this.state.tripId;
        this.getTripDetails(tripId);
    }

    TripHomeComponent = () =>
        <div>
            <h4>Trip Details</h4>
            <h6>Proposed by : {this.state.tripOwner.userName}</h6>
            <br />
            <div>
                <label>Destination : {this.state.destination}</label>
            </div>
        </div>

    handleDayClick(day, { selected }) {
        const { selectedDays } = this.state;
        if (selected) {
            const selectedIndex = selectedDays.findIndex(selectedDay =>
                DateUtils.isSameDay(new Date(selectedDay), day)
            );
            selectedDays.splice(selectedIndex, 1);
        } else {
            selectedDays.push(day);
        }
        this.setState({ selectedDays });
    }

    DateComponent = () => {
        const modifiers = {
            days: this.state.tripSelectedDays.map((day) => new Date(day).getDate() >= new Date().getDate() ? new Date(day) : '')
        };
        const modifiersStyles = {
            days: {
                borderStyle: 'solid',
                borderColor: 'burlywood',
                borderRadius: '50%'
            }
        };
        return (
            <div>
                <h4>Select multiple trip dates when you are able to make a trip.</h4>
                <h6>Outlined dates suggested by : {this.state.tripOwner.userName}</h6>
                <DayPicker modifiers={modifiers} month={new Date(this.state.tripSelectedDays[0] || new Date().toDateString())}
                    modifiersStyles={modifiersStyles} selectedDays={this.state.selectedDays.map((day) => new Date(day))}
                    disabledDays={{ before: new Date() }} onDayClick={this.handleDayClick.bind(this)}
                />
            </div>
        )
    }

    ShareAndCarComponent = () =>
        <div>
            <h4>Trip Share and Car Details</h4>
            <br />
            <label style={{ paddingRight: '10px' }}>Enter the share you are willing to contribute for the trip (in $)</label>
            <input className="inputShare inputPlace" placeholder="Enter a Share Amount in $" required={true} type="number" defaultValue={this.state.userOtherOptions.userShare}
                onChange={(e) => {
                    const { userOtherOptions } = this.state;
                    userOtherOptions.userShare = e.target.value;
                    this.setState({ userOtherOptions });
                }} />
            <br />
            <div >
                <label style={{ paddingRight: '15px' }}>Do you own a car for the trip?</label>
                <label>
                    <input type="checkbox" checked={this.state.userOtherOptions.userHasCar} onChange={(e) => {
                        const { userOtherOptions } = this.state;
                        userOtherOptions.userHasCar = !this.state.userOtherOptions.userHasCar;
                        this.setState({ userOtherOptions });
                    }} /><span style={{ paddingLeft: '5px' }}>Yes</span>
                </label>
            </div>
            <br />
            {this.state.userOtherOptions.userHasCar ?
                <div>
                    <label style={{ paddingRight: '10px' }}>How many people you can accomodate?</label>
                    <input className="inputCarSeating inputPlace" placeholder="How many people you can accomodate?" required={true} type="number" defaultValue={this.state.userOtherOptions.userCarFit}
                        onChange={(e) => {
                            const { userOtherOptions } = this.state;
                            userOtherOptions.userCarFit = e.target.value;
                            this.setState({ userOtherOptions });
                        }} />
                </div> : ""}

        </div>

    generateTripOptions = () => {
        const userId = this.state.user.userId;
        const tripSelectedOptions = this.state.tripSelectedOptions;
        const newUserSelection = { userName: this.state.user.userName, selectedGooglePlaces: this.state.selectedGooglePlaces, selectedAirbnbPlaces: this.state.selectedAirbnbPlaces, selectedRestaurants: this.state.selectedRestaurants, selectedDays: this.state.selectedDays, userOtherOptions: this.state.userOtherOptions };
        tripSelectedOptions[userId] = newUserSelection;
        this.saveTripOptions(tripSelectedOptions);
        this.saveUserNewResponse(this.state.tripId, this.state.destination);
    }

    saveTripOptions = (tripOptions) => {
        const url = '/tripOptions';
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        axios.post(url, { tripId: this.state.tripOId, data: tripOptions }, { headers }
        ).then((res) => {
            //console.log("Options Saved");
            //console.log(res.data);
        }).catch((error) => {
            //console.log(error);
        });
    }

    saveUserNewResponse = async (tripId, tripDestination) => {
        const url = '/userNewResponse';
        const newTrip = { tripId, tripDestination, tripResponseDate: new Date() };
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        axios.post(url, { data: newTrip }, { headers }
        ).then((res) => {
            //console.log("User Response Saved");
            //console.log(res.data);
        }).catch((error) => {
            //console.log(error);
        });
    }

    TripSuccessComponent = () =>
        <div>
            <h4>Trip Options Saved Successful!</h4>
            <br /><br />
            <p>Thank You for selecting the trip options. The trip owner <span style={{ color: "brown" }}>{this.state.tripOwner.userName} </span> will finalize the trip!</p>
        </div>

    handleGoogleClick = (place, e) => {
        e.preventDefault();
        const { selectedGooglePlaces } = this.state;
        if (selectedGooglePlaces[place.id] !== 1) {
            selectedGooglePlaces[place.id] = 1;
            if (e.target.parentElement.id === 'googleGrid') {
                e.target.parentElement.className = 'card grid-item-selected'
            } else if (e.target.id === 'googleGrid') {
                e.target.className = 'card grid-item-selected'
            };
        } else {
            delete selectedGooglePlaces[place.id];
            if (e.target.parentElement.id === 'googleGrid') {
                e.target.parentElement.className = 'card grid-item'
            } else if (e.target.id === 'googleGrid') {
                e.target.className = 'card grid-item'
            };
        }
        this.setState({ selectedGooglePlaces });
    }

    handleAirbnbClick = (lis, e) => {
        e.preventDefault();
        const { selectedAirbnbPlaces } = this.state;
        if (selectedAirbnbPlaces[lis.id] !== 1) {
            selectedAirbnbPlaces[lis.id] = 1;
            if (e.target.parentElement.id === 'airbnbGrid') {
                e.target.parentElement.className = 'card grid-item-selected'
            } else if (e.target.id === 'airbnbGrid') {
                e.target.className = 'card grid-item-selected'
            };
        } else {
            delete selectedAirbnbPlaces[lis.id];
            if (e.target.parentElement.id === 'airbnbGrid') {
                e.target.parentElement.className = 'card grid-item'
            } else if (e.target.id === 'airbnbGrid') {
                e.target.className = 'card grid-item'
            };
        }
        this.setState({ selectedAirbnbPlaces });
    }

    handleRestaurantClick = (restaurant, e) => {
        e.preventDefault();
        const { selectedRestaurants } = this.state;
        if (selectedRestaurants[restaurant.id] !== 1) {
            selectedRestaurants[restaurant.id] = 1;
            if (e.target.parentElement.id === 'restaurantGrid') {
                e.target.parentElement.className = 'card grid-item-selected'
            } else if (e.target.id === 'restaurantGrid') {
                e.target.className = 'card grid-item-selected'
            };
        } else {
            delete selectedRestaurants[restaurant.id];
            if (e.target.parentElement.id === 'restaurantGrid') {
                e.target.parentElement.className = 'card grid-item'
            } else if (e.target.id === 'restaurantGrid') {
                e.target.className = 'card grid-item'
            };
        }
        this.setState({ selectedRestaurants });
    }

    SpinComponent = () => <div className='Loader'>Loading...</div>

    switchComponent = (e) => {
        switch (e) {
            case 0: return <this.SelectHomeComponent />
            case 1: return <this.TripHomeComponent />
            case 2: return <this.DateComponent />
            case 3: return <GoogleTest destination={this.state.destination} showSelection={true} tripOwnerUserName={this.state.tripOwner.userName} listGooglePlaces={this.state.listGooglePlaces} selectedGooglePlaces={this.state.selectedGooglePlaces} handleGoogleClick={this.handleGoogleClick} />
            case 4: return <AirbnbTest destination={this.state.destination} showSelection={true} tripOwnerUserName={this.state.tripOwner.userName} listAirbnbPlaces={this.state.listAirbnbPlaces} selectedAirbnbPlaces={this.state.selectedAirbnbPlaces} handleAirbnbClick={this.handleAirbnbClick} />
            case 5: return <RestaurantTest destination={this.state.destination} showSelection={true} tripOwnerUserName={this.state.tripOwner.userName} listRestaurants={this.state.listRestaurants} selectedRestaurants={this.state.selectedRestaurants} handleRestaurantClick={this.handleRestaurantClick} />
            case 6: return <this.ShareAndCarComponent />
            case 7: return <this.TripSuccessComponent />
            case 8: return <this.SpinComponent />
            default: return <h4>Please <Link to="/login" >Login</Link></h4>
        }
    }

    render() {
        return (
            <div className="container">
                <br />
                {this.state.activeStep >= 1 && this.state.activeStep <= 6 ? <div className="progress">
                    <div ref="progressTrip" className="progress-bar progress-bar-striped bg-dark" role="progressbar" style={{ width: this.state.width + '%' }} aria-valuemin="0" aria-valuemax="100">{this.state.width}%</div>
                </div> : <div></div>}
                <div className="jumbotron container" id="switchHome" style={styles.divHome}>
                    {this.state.activeStep >= 0 ?
                        <div>
                            {this.switchComponent(this.state.activeStep)}
                            <br /><br />
                            {this.state.activeStep > 0 && this.state.activeStep < 7 ?
                                <div className="d-flex justify-content-around">

                                    <button className="btn btn-light" onClick={() => {
                                        this.refs.progressTrip.style.width = this.state.width - 20 + '%';
                                        this.setState({ activeStep: this.state.activeStep - 1, width: this.state.width - 20 });
                                        let elmnt = document.getElementById("root");
                                        setTimeout(() => elmnt.scrollIntoView(), 0);
                                    }} disabled={this.state.activeStep === 0}>Back</button>

                                    {this.state.activeStep !== 6 ?
                                        <button className="btn btn-dark" onClick={() => {
                                            this.refs.progressTrip.style.width = this.state.width + 20 + '%';
                                            this.setState({ activeStep: this.state.activeStep + 1, width: this.state.width + 20 });
                                            let elmnt = document.getElementById("root");
                                            setTimeout(() => elmnt.scrollIntoView(), 0);

                                        }}>Next</button>
                                        :
                                        <button className="btn btn-dark" onClick={() => {
                                            this.generateTripOptions();
                                            this.setState({ activeStep: this.state.activeStep + 1 })
                                        }}>Finish</button>}
                                </div>
                                : <div></div>}
                        </div>
                        :
                        <div></div>
                    }
                    <br /><br />
                    <h6>Proceed to <Link to="/">Home</Link></h6>
                </div>
            </div>
        );
    }
}

export default withRouter(Select);