import React, { Component } from 'react';
import axios from 'axios';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class Propose extends Component {
    constructor(props) {
        super(props);
        this.state = { destination: "", friends: [], selUrl: "", optUrl: "", destPlaces: [], owner: "", tripId: "", selectedDays: [], data: [], selectListings: [] };
    }
    componentDidMount() {
        const friends = [{ id: 1, email: "rk1@gmail.com" }, { id: 2, email: "rk2@gmail.com" }, { id: 3, email: "rk3@gmail.com" }];
        this.setState({ friends: friends });
    }


    googlePlaces = (dest) => {
        const url = '/places?dest=' + dest;
        axios.get(url,
        ).then((res) => {
            if (res.data.results.length) {
                this.airbnbPlaces(dest).then((resPlaces) => {
                    const selListings = resPlaces.map((e) => {
                        const lis = {
                            name: e.listing.name,
                            city: e.listing.localized_city,
                            room: e.listing.room_type,
                            thumb: e.listing.thumbnail_url,
                            price: e.pricing_quote.localized_nightly_price
                        }
                        return lis;
                    });
                    const tripId = Math.round(10000 + Math.random() * 10000, 5);
                    const googlePlaces = res.data.results;
                    const trip = { tripId: tripId, city: dest, cityPlaces: googlePlaces, options: [], owner: this.state.owner, tripDays: this.state.selectedDays, airbnbPlaces: selListings }
                    const selUrl = '/select?tripId=' + tripId;
                    const optUrl = '/options?tripId=' + tripId;
                    this.setState({ destPlaces: googlePlaces, tripId: tripId, selUrl: selUrl, optUrl: optUrl, selectListings: selListings });
                    //console.log(trip);
                    this.saveToDb(trip);
                });
            }
            else {
                this.setState({ tripId: "default" });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    airbnbPlaces = (dest) => {
        return new Promise((resolve, reject) => {
            const url = '/listings?dest=' + dest;
            axios.get(url,
            ).then((res) => {
                const results = res.data.search_results;
                resolve(results);
            }).catch((error) => {
                reject(error);
            });
        })

    }

    saveToDb = (trip) => {
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ';
        axios.post(url, trip
        ).then((res) => {
            console.log("Saved");
            console.log(res.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    /* linkToShare = () => {
        const queryParams = [];
        queryParams.push(encodeURIComponent("dest") + '=' + encodeURIComponent(this.state.destination))
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/select',
            search: '?' + queryString
        });
    } */

    generateTrip = (e) => {
        e.preventDefault();
        const dest = this.state.destination;
        this.googlePlaces(dest);
    }

    DisplayLinks = () => <div>
        <div>
            <div><label>Link to Share : <span>{'localhost:3000' + this.state.selUrl}</span></label></div>
            <button className="btn btn-link" onClick={() => this.props.history.push(this.state.selUrl)}> Click to Preview</button>
        </div>
        <div>
            <div><label>Link to View Options : <span>{'localhost:3000' + this.state.optUrl}</span></label></div>
            <button className="btn btn-link" onClick={() => this.props.history.push(this.state.optUrl)}> Click to See Options</button>
        </div>
    </div>

    DisplayGooglePlaces = () =>
        <div className="list-group-item form-group">
            {this.state.destPlaces.map((place, index) => (
                <div className="initialTrip" key={index}>
                    <button className="btn btn-link" onClick={(e) => {
                        e.preventDefault();
                        const url = 'https://google.com/search?q=' + place.name;
                        window.open(url, '_blank', 'height=500,width=1400');
                    }}>{place.name}</button>
                </div>
            ))}
        </div>

    DisplayGroup = () =>
        <div><this.DisplayLinks />
            <label>Trip ID : {this.state.tripId}</label>
            <h4>List of Near By Tourist Attractions</h4>
            <this.DisplayGooglePlaces />
            <h4>List of Available Housing Options</h4>
            <this.DisplayListings />
        </div>

    DisplayListings = () =>
        <div className="grid-container">
            {this.state.selectListings.map((lis, index) => (
                <div className="card grid-item" key={index}>
                    <img className="card-img-top" src={lis.thumb} alt="" />
                    <div className="card-body">
                        <h5 className="card-title">{lis.name}</h5>
                        <p className="card-text">Price : <b>${lis.price}</b></p>
                    </div>
                </div>
            ))}
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

    DisplayDayPicker = () => <div>
        <DayPicker
            selectedDays={this.state.selectedDays}
            onDayClick={this.handleDayClick.bind(this)}
        />
    </div>

    getPlaceSuggestions = (enteredPlace) => {
        const url = '/placeSuggestions?dest=' + enteredPlace;
        axios.get(url,
        ).then((res) => {

            const suggestedPlaces = res.data;
            this.setState({ data: suggestedPlaces });

        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="jumbotron container">
                <form onSubmit={this.generateTrip}>
                    <label>Enter Your Name</label>
                    <input className="form-control" placeholder="User Name" required={true} onChange={(e) => { this.setState({ owner: e.target.value }) }} />

                    <label>Propose a City for a Trip</label>

                    <input className="inputPlace form-control" placeholder="Enter a destination" required={true} type="text" list="data" onChange={(e) => { this.getPlaceSuggestions(e.target.value); this.setState({ destination: e.target.value }) }} />

                    <datalist id="data">
                        {this.state.data.map((item) =>
                            <option value={item} key={item} />
                        )}
                    </datalist>

                    <label>Choose the Trip Dates</label>
                    <this.DisplayDayPicker />
                    <br />
                    <button className="btn btn-primary" >Generate Trip</button>
                    <br /><br />
                </form>
                {this.state.destPlaces.length ? <this.DisplayGroup /> : <label>{isFinite(this.state.tripId) ? "" : <label>Please enter a Valid City</label>}</label>}
            </div>
        );
    }
}

export default Propose;