import React, { Component } from 'react';
import axios from 'axios';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import testG from './testG.json';
import testA from './testA.json';

const styles = {
    divHome: {
        backgroundColor: "rgba(255, 255, 255)",
        textAlign: 'center',
        marginTop: '15px'
    },
    inputPlace: {
        borderRadius: '4px',
        display: 'block',
        width: '50%',
        height: '34px',
        padding: '6px 12px',
        fontSize: '14px',
        lineHeight: '1.42857143',
        color: '#555',
        border: '1px solid #ccc',
        boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
        margin: '0 auto'
    }
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: "", activeStep: 0, destination: "", suggestedPlaces: [], selectedDays: [], listAirbnbPlaces: [], listGooglePlaces: testG, selectedGooglePlaces: {}, selectedAirbnbPlaces: {}, userOtherOptions: { userShare: 0, userHasCar: false, userCarFit: 0 } };
    }

    componentDidMount() {
        const airbnbListings = testA.map((e) => {
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
        this.setState({ listAirbnbPlaces: airbnbListings });
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
            <DayPicker selectedDays={this.state.selectedDays} onDayClick={this.handleDayClick.bind(this)}
            />
        </div>

    generateGoogleAndAirbnbPlaces = () => {
        const dest = this.state.destination;
        this.googlePlaces(dest);
        //this.airbnbPlaces(dest);
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

    googlePlaceSearchHandler = (place) => {
        const url = 'https://google.com/search?q=' + place + ', ' + this.state.destination;
        window.open(url, '_blank', 'height=500,width=1400');
    }

    GooglePlacesComponent = () =>
        <div>
            <h4>Choose the list of interesting tourist attractions! {this.state.destination}</h4>
            <br />
            <div className="grid-container">
                {this.state.listGooglePlaces.map((place, index) => (
                    <div id="googleGrid" className={this.state.selectedGooglePlaces[place.id] === 1 ? "card grid-item-selected" : "card grid-item"} key={index} onClick={this.handleGoogleClick.bind(this, place)}>
                        <h6>{place.name} {' '}
                            <a style={{ fontSize: '13px' }} className="btn-link" href='/#' onClick={this.googlePlaceSearchHandler.bind(this, place.name)}>More...</a>
                        </h6>
                    </div>
                ))}
            </div>
        </div>

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


    airbnbRoomSearchHandler = (roomId) => {
        const url = 'https://www.airbnb.com/rooms/' + roomId + '?guests=1&adults=1';
        window.open(url, '_blank', 'height=500,width=1400');
    }

    AirbnbPlacesComponent = () =>
        <div>
            <h4>Choose the list of Airbnb accomodations! {this.state.destination}</h4>
            <br />
            <div className="grid-container">
                {this.state.listAirbnbPlaces.map((lis, index) => (
                    <div id="airbnbGrid" className={this.state.selectedAirbnbPlaces[lis.id] === 1 ? "card grid-item-selected" : "card grid-item"} key={index} onClick={this.handleAirbnbClick.bind(this, lis)}>
                        <img className="card-img-top" src={lis.thumb} alt="" />
                        <h6 className="">{lis.name} </h6>
                        <h6>${lis.price} per night{' '}
                            <a style={{ fontSize: '13px' }} className="btn-link" href='/#' onClick={this.airbnbRoomSearchHandler.bind(this, lis.id)}>More...</a>
                        </h6>
                    </div>
                ))}
            </div>
        </div>

    ShareAndCarComponent = () =>
        <div>
            <h4>Trip Share and Car Details</h4>
            <br />
            <label style={{ paddingRight: '10px' }}>Enter your share for the Trip (in $)</label>
            <input className="inputShare" style={styles.inputPlace} placeholder="Enter a Share Amount in $" required={true} type="number" defaultValue={this.state.userOtherOptions.userShare}
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
                    <input className="inputCarSeating" style={styles.inputPlace} placeholder="How many people you can accomodate?" required={true} type="number" defaultValue={this.state.userOtherOptions.userCarFit}
                        onChange={(e) => {
                            const { userOtherOptions } = this.state;
                            userOtherOptions.userCarFit = e.target.value;
                            this.setState({ userOtherOptions });
                        }} />
                </div> : ""}

        </div>

    generateNewTrip = () => {
        const tripId = Math.round(10000 + Math.random() * 10000, 5);
        const userSelection = { userId: this.state.userId, selectedGooglePlaces: this.state.selectedGooglePlaces, selectedAirbnbPlaces: this.state.selectedAirbnbPlaces, selectedDays: this.state.selectedDays, userOtherOptions: this.state.userOtherOptions };
        const trip = { tripId: tripId, tripDestination: this.state.destination, tripListGooglePlaces: this.state.listGooglePlaces, tripOwnerId: this.state.userId, tripSelectedDays: this.state.selectedDays, tripListAirbnbPlaces: this.state.listAirbnbPlaces, tripSelectedOptions: userSelection };
        const tripSelectionUrl = '/select?tripId=' + tripId;
        const tripOptionsUrl = '/options?tripId=' + tripId;
        this.setState({ tripId, tripSelectionUrl, tripOptionsUrl });
        //console.log(trip);
        this.saveNewTrip(trip);
    }

    saveNewTrip = (trip) => {
        const url = '/newTrip';
        axios.post(url, { data: trip }
        ).then((res) => {
            console.log("Saved");
            console.log(res.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    DisplayLinks = () => <div>
        <div>
            <label>Link to Share : <span>{'http://localhost:3000' + this.state.tripSelectionUrl}</span></label>
            <button className="btn btn-link" onClick={() => this.props.history.push(this.state.tripSelectionUrl)}> Click to Preview</button>
        </div>
        <div>
            <label>Link to View Options : <span>{'http://localhost:3000' + this.state.tripOptionsUrl}</span></label>
            <button className="btn btn-link" onClick={() => this.props.history.push(this.state.tripOptionsUrl)}> Click to See Options</button>
        </div>
    </div>

    TripSuccessComponent = () =>
        <div>
            <h4>Trip Successful! Share with friends...</h4>
            <br />
            <this.DisplayLinks />
            <br />
            <h4>Proceed to <a href="/">Home</a></h4>
        </div>


    switchComponent = (e) => {
        switch (e) {
            case 0: return <this.CityComponent />
            case 1: return <this.DateComponent />
            case 2: return <this.GooglePlacesComponent />
            case 3: return <this.AirbnbPlacesComponent />
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
            </div>
        );
    }
}

export default Home;