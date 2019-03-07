import React, { Component } from 'react';
import axios from 'axios';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import AirbnbTest from '../components/AirbnbComponent';
import GoogleTest from '../components/GoogleComponent';
import RestaurantTest from '../components/RestaurantComponent';
import ShareComponent from '../components/ShareComponent';
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
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        this.state = { user: { userId, userName }, activeStep: 0, destination: "", width: 0, tripSelectionUrl: "https://rkbeavs.me/trpo/select?tripId=", suggestedPlaces: ['New York, USA', 'San Francisco, USA', 'Florida, USA', 'Portland, USA'], selectedDays: [], listAirbnbPlaces: [], listGooglePlaces: [], selectedGooglePlaces: {}, listRestaurants: [], selectedRestaurants: {}, selectedAirbnbPlaces: {}, userOtherOptions: { userShare: 0, userHasCar: false, userCarFit: 0 } };
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
            <input className="form-control" style={{ width: '50%', margin: "auto" }} placeholder="Enter a destination" required={true} type="text" defaultValue={this.state.destination}
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
        this.restaurants(dest);
    }

    googlePlaces = (dest) => {
        const url = '/places?dest=' + dest;
        axios.get(url,
        ).then((res) => {
            const googleListings = res.data;
            this.setState({ listGooglePlaces: googleListings });
        }).catch((error) => {
            console.log(error);
        });
    }

    restaurants = (dest) => {
        const url = '/restaurants?dest=' + dest;
        axios.get(url,
        ).then((res) => {
            const restaurants = res.data;
            this.setState({ listRestaurants: restaurants });
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
        const userId = this.state.user.userId;
        userSelection[userId] = { userName: this.state.user.userName, selectedGooglePlaces: this.state.selectedGooglePlaces, selectedAirbnbPlaces: this.state.selectedAirbnbPlaces, selectedRestaurants: this.state.selectedRestaurants, selectedDays: this.state.selectedDays, userOtherOptions: this.state.userOtherOptions };

        const trip = { tripId: tripId, tripDestination: this.state.destination, tripListGooglePlaces: this.state.listGooglePlaces, tripOwner: this.state.user, tripSelectedDays: this.state.selectedDays, tripListAirbnbPlaces: this.state.listAirbnbPlaces, tripListRestaurants: this.state.listRestaurants, tripSelectedOptions: userSelection };
        const tripSelectionUrl = this.state.tripSelectionUrl + tripId;
        this.setState({ tripId, tripSelectionUrl });
        //console.log(trip);
        this.saveNewTrip(trip);
        this.saveUserNewTrip(tripId, this.state.destination)
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

    saveUserNewTrip = async (tripId, tripDestination) => {
        const url = '/userNewTrip';
        const newTrip = { tripId, tripDestination, tripPlanDate: new Date() };
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        axios.post(url, { data: newTrip }, { headers }
        ).then((res) => {
            console.log("User Trip Saved");
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

    TripSuccessComponent = () =>
        <div>
            <h4>Trip Successful! Share with friends...</h4>
            <br /><br />
            <ShareComponent destination={this.state.destination} tripSelectionUrl={this.state.tripSelectionUrl} user={this.state.user} />
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
            case 4: return <RestaurantTest destination={this.state.destination} listRestaurants={this.state.listRestaurants} selectedRestaurants={this.state.selectedRestaurants} handleRestaurantClick={this.handleRestaurantClick} />
            case 5: return <this.ShareAndCarComponent />
            default: return <h4>Please <Link to="/login" >Login</Link></h4>
        }
    }

    render() {
        return (
            <div className="container">
                <br />
                {this.state.activeStep <= 5 ? <div className="progress">
                    <div ref="progressTrip" className="progress-bar progress-bar-striped bg-dark" role="progressbar" style={{ width: this.state.width + '%' }} aria-valuemin="0" aria-valuemax="100">{this.state.width}%</div>
                </div> : <div></div>}
                <div className="jumbotron container" style={styles.divHome}>
                    {this.state.activeStep !== 6 ?
                        <div>
                            {this.switchComponent(this.state.activeStep)}
                            <br /><br />
                            <div className="d-flex justify-content-around">

                                <button className="btn btn-light" onClick={() => {
                                    this.refs.progressTrip.style.width = this.state.width - 20 + '%';
                                    this.setState({ activeStep: this.state.activeStep - 1, width: this.state.width - 20 })
                                }} disabled={this.state.activeStep === 0}>Back</button>

                                {this.state.activeStep !== 5 ?
                                    <button className="btn btn-dark" onClick={() => {
                                        if (this.state.destination !== "" && this.state.activeStep === 0) {
                                            this.generateGoogleAndAirbnbPlaces();
                                        };
                                        this.refs.progressTrip.style.width = this.state.width + 20 + '%';
                                        this.setState({ activeStep: this.state.activeStep + 1, width: this.state.width + 20 })
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
            </div>
        );
    }
}

export default withRouter(Propose);