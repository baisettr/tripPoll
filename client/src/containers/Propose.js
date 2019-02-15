import React, { Component } from 'react';
import axios from 'axios';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import AirbnbTest from '../components/AirbnbComponent';
import GoogleTest from '../components/GoogleComponent';
import { withRouter, Link } from 'react-router-dom';

const styles = {
    divHome: {
        backgroundColor: "rgba(255, 255, 255)",
        textAlign: 'center',
        marginTop: '15px'
    }
}

class Propose extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: "8907", activeStep: 0, destination: "", suggestedPlaces: [], selectedDays: [], listAirbnbPlaces: [], listGooglePlaces: [], selectedGooglePlaces: {}, selectedAirbnbPlaces: {}, userOtherOptions: { userShare: 0, userHasCar: false, userCarFit: 0 } };
    }

    getPlaceSuggestions = (enteredPlace) => {
        const url = '/placeSuggestions?dest=' + enteredPlace;
        axios.get(url,
        ).then((res) => {

            const sugPlaces = res.data;
            this.setState({ suggestedPlaces: sugPlaces });

        }).catch((error) => {
            console.log(error);
        });
    }

    CityComponent = () =>
        <div>
            <h4>Propose a City for a Trip</h4>
            <br />
            <input className="inputPlace" style={styles.inputPlace} placeholder="Enter a destination" required={true} type="text" defaultValue={this.state.destination}
                list="data" onChange={(e) => { this.getPlaceSuggestions(e.target.value); this.setState({ destination: e.target.value }) }} />
            <datalist id="data">
                {this.state.suggestedPlaces.map((item) =>
                    <option value={item} key={item} />
                )}
            </datalist>
        </div>

    generateGoogleAndAirbnbPlaces = () => {
        const dest = this.state.destination;
        this.googlePlaces(dest);
        this.airbnbPlaces(dest);
    }

    googlePlaces = (dest) => {
        const url = '/places?dest=' + dest;
        axios.get(url,
        ).then((res) => {
            const googleListings = res.data.results;
            this.setState({ listGooglePlaces: googleListings });
        }).catch((error) => {
            console.log(error);
        });
    }

    airbnbPlaces = (dest) => {
        const url = '/listings?dest=' + dest;
        axios.get(url,
        ).then((res) => {
            const results = res.data.search_results;
            const airbnbListings = results.map((e) => {
                const lis = {
                    id: e.listing.id,
                    name: e.listing.name,
                    city: e.listing.localized_city,
                    room: e.listing.room_type,
                    thumb: e.listing.thumbnail_url,
                    price: e.pricing_quote.localized_nightly_price
                }
                return lis;
            });
            this.setState({ listAirbnbPlaces: airbnbListings })
        }).catch((error) => {
            console.log(error);
        });
    }

    generateNewTrip = () => {
        const tripId = Math.round(10000 + Math.random() * 10000, 5);
        const userSelection = {};
        const userId = this.state.userId;
        /* const selectedGooglePlaces = this.state.selectedGooglePlaces;
        const selectedAirbnbPlaces = this.state.selectedAirbnbPlaces;
        let userSelectedGooglePlaces = [];
        let userSelectedAirbnbPlaces = [];
        for (place in selectedGooglePlaces) {
            userSelectedGooglePlaces = [...selectedGooglePlaces[place]]
        }
        for (place in selectedAirbnbPlaces) {
            userSelectedAirbnbPlaces = [...selectedAirbnbPlaces[place]]
        } */
        userSelection[userId] = { selectedGooglePlaces: this.state.selectedGooglePlaces, selectedAirbnbPlaces: this.state.selectedAirbnbPlaces, selectedDays: this.state.selectedDays, userOtherOptions: this.state.userOtherOptions };

        const trip = { tripId: tripId, tripDestination: this.state.destination, tripListGooglePlaces: this.state.listGooglePlaces, tripOwnerId: this.state.userId, tripSelectedDays: this.state.selectedDays, tripListAirbnbPlaces: this.state.listAirbnbPlaces, tripSelectedOptions: userSelection };
        const tripSelectionUrl = '/select?tripId=' + tripId;
        const tripOptionsUrl = '/options?tripId=' + tripId;
        this.setState({ tripId, tripSelectionUrl, tripOptionsUrl });
        //console.log(trip);
        this.saveNewTrip(trip);
    }

    saveNewTrip = (trip) => {
        const url = '/tripNew';
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        axios.post(url, { data: trip }, { headers }
        ).then((res) => {
            console.log("Saved");
            console.log(res.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    handleDayClick(day, { selected }) {
        const { selectedDays } = this.state;
        if (selected) {
            const selectedIndex = selectedDays.findIndex(selectedDay =>
                DateUtils.isSameDay(selectedDay, day)
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
            <DayPicker selectedDays={this.state.selectedDays} disabledDays={{ before: new Date() }} onDayClick={this.handleDayClick.bind(this)}
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

    DisplayLinks = () => <div>
        <div>
            <label>Link to Share</label>
            <input className="inputPlace" defaultValue={'http://localhost:3000' + this.state.tripSelectionUrl} readOnly />
            <button className="btn btn-link" onClick={() => this.props.history.push(this.state.tripSelectionUrl)}> Click to Preview</button>
        </div>
        <br />
        <div>
            <label>Link to View Options</label>
            <input className="inputPlace" defaultValue={'http://localhost:3000' + this.state.tripOptionsUrl} readOnly />
            <button className="btn btn-link" onClick={() => this.props.history.push(this.state.tripOptionsUrl)}> Click to See Options</button>
        </div>
    </div>

    TripSuccessComponent = () =>
        <div>
            <h4>Trip Successful! Share with friends...</h4>
            <br />
            <this.DisplayLinks />
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
            case 0: return <this.CityComponent />
            case 1: return <this.DateComponent />
            case 2: return <GoogleTest destination={this.state.destination} listGooglePlaces={this.state.listGooglePlaces} selectedGooglePlaces={this.state.selectedGooglePlaces} handleGoogleClick={this.handleGoogleClick} />
            case 3: return <AirbnbTest destination={this.state.destination} listAirbnbPlaces={this.state.listAirbnbPlaces} selectedAirbnbPlaces={this.state.selectedAirbnbPlaces} handleAirbnbClick={this.handleAirbnbClick} />
            case 4: return <this.ShareAndCarComponent />
            default: return <h4>Please <Link to="/login" >Login</Link></h4>
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
                                    if (this.state.destination !== "" && this.state.activeStep === 0) {
                                        this.generateGoogleAndAirbnbPlaces();
                                    }
                                    this.setState({ activeStep: this.state.activeStep + 1 })
                                }}>Next</button>
                                :
                                <button className="btn btn-dark" onClick={() => {
                                    this.generateNewTrip();
                                    this.setState({ activeStep: this.state.activeStep + 1 })
                                }}>Finish</button>}
                        </div>
                    </div>
                    :
                    <this.TripSuccessComponent />
                }
                <br /><br />
                <h6>Proceed to <Link to="/">Home</Link></h6>
            </div>
        );
    }
}

export default withRouter(Propose);