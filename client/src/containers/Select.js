import React, { Component } from 'react';
import axios from 'axios';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import AirbnbTest from '../components/AirbnbComponent';
import GoogleTest from '../components/GoogleComponent';

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
        this.state = { userId: "8906", tripId: "", tripOId: '', activeStep: 0, destination: "", userSelection: {}, tripSelectedOptions: {}, selectedDays: [], listAirbnbPlaces: [], listGooglePlaces: [], selectedGooglePlaces: {}, selectedAirbnbPlaces: {}, userOtherOptions: { userShare: 0, userHasCar: false, userCarFit: 0 } };
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const queryParams = {};
        for (let param of query.entries()) {
            queryParams[param[0]] = param[1];
        }
        const tripId = queryParams["tripId"];
        this.setState({ tripId: tripId });
        this.getTripDetails(tripId);
    }

    getTripDetails = (tripId) => {
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        const url = '/trip?tripId=' + tripId;
        axios.get(url, { headers }
        ).then((res) => {
            const trip = res.data[0];
            const { _id, tripDestination, tripSelectedDays, tripListGooglePlaces, tripListAirbnbPlaces, tripSelectedOptions } = trip;
            const userId = this.state.userId;
            const userSelection = tripSelectedOptions[userId] ? tripSelectedOptions[userId] : {};
            this.setState({ tripOId: _id.$oid, destination: tripDestination, selectedDays: tripSelectedDays, listGooglePlaces: tripListGooglePlaces, listAirbnbPlaces: tripListAirbnbPlaces, tripSelectedOptions, userSelection });
        }).catch((error) => {
            console.log(error);
        });
    }

    TripHomeComponent = () =>
        <div>
            <h4>Trip Details</h4>
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

    DateComponent = () =>
        <div>
            <h4>Choose the Trip Dates</h4>
            <br />
            <DayPicker selectedDays={this.state.selectedDays.map((day) => new Date(day))}
                disabledDays={{ before: new Date() }} onDayClick={this.handleDayClick.bind(this)}
            />
        </div>

    ShareAndCarComponent = () =>
        <div>
            <h4>Trip Share and Car Details</h4>
            <br />
            <label style={{ paddingRight: '10px' }}>Enter your share for the Trip (in $)</label>
            <input className="inputShare inputPlace" placeholder="Enter a Share Amount in $" required={true} type="number" defaultValue={this.state.userOtherOptions.userShare}
                onChange={(e) => {
                    const { userOtherOptions } = this.state;
                    userOtherOptions.userShare = e.target.value;
                    this.setState({ userOtherOptions });
                }} />
            <br />
            <div >
                <label style={{ paddingRight: '15px' }}>Do you own a Car for the Trip?</label>
                <label>
                    <input type="radio" value="yes" onClick={(e) => {
                        const { userOtherOptions } = this.state;
                        userOtherOptions.userHasCar = true;
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
        const userId = this.state.userId;
        const { tripSelectedOptions } = this.state;
        const newUserSelection = { selectedGooglePlaces: this.state.selectedGooglePlaces, selectedAirbnbPlaces: this.state.selectedAirbnbPlaces, selectedDays: this.state.selectedDays, userOtherOptions: this.state.userOtherOptions };

        tripSelectedOptions[userId] = newUserSelection;

        this.saveTripOptions(tripSelectedOptions);
    }

    saveTripOptions = (tripOptions) => {
        const url = '/tripOptions';
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        axios.post(url, { tripId: this.state.tripOId, data: tripOptions }, { headers }
        ).then((res) => {
            console.log("Options Saved");
            console.log(res.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    TripSuccessComponent = () =>
        <div>
            <h4>Trip Options Saved Successful!</h4>
            <br />
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

    switchComponent = (e) => {
        switch (e) {
            case 0: return <this.TripHomeComponent />
            case 1: return <this.DateComponent />
            case 2: return <GoogleTest destination={this.state.destination} listGooglePlaces={this.state.listGooglePlaces} selectedGooglePlaces={this.state.selectedGooglePlaces} handleGoogleClick={this.handleGoogleClick} />
            case 3: return <AirbnbTest destination={this.state.destination} listAirbnbPlaces={this.state.listAirbnbPlaces} selectedAirbnbPlaces={this.state.selectedAirbnbPlaces} handleAirbnbClick={this.handleAirbnbClick} />
            case 4: return <this.ShareAndCarComponent />
            default: return <h4>Please <a href="/login" >Login</a></h4>
        }
    }

    render() {
        return (
            <div className="jumbotron container" style={styles.divHome}>
                {this.state.activeStep !== 5 ?
                    <div>
                        {this.switchComponent(this.state.activeStep)}
                        <br /><br />
                        <div className="d-flex justify-content-around">

                            <button className="btn btn-light" onClick={() => {
                                this.setState({ activeStep: this.state.activeStep - 1 })
                            }} disabled={this.state.activeStep === 0}>Back</button>

                            {this.state.activeStep !== 4 ?
                                <button className="btn btn-dark" onClick={() => {
                                    this.setState({ activeStep: this.state.activeStep + 1 })
                                }}>Next</button>
                                :
                                <button className="btn btn-dark" onClick={() => {
                                    this.generateTripOptions();
                                    this.setState({ activeStep: this.state.activeStep + 1 })
                                }}>Finish</button>}
                        </div>
                    </div>
                    :
                    <this.TripSuccessComponent />
                }
                <br /><br />
                <h6>Proceed to <a href="/">Home</a></h6>
            </div>
        );
    }
}

export default Select;