import React, { Component } from 'react';

import places from './places.json';

class Place extends Component {
    constructor(props) {
        super(props);
        this.state = { place: "", commonCities: ["San Francisco", "New York", "Los Angeles", "San Diego", "Boston"], updatedPlaces: [] };
    }
    /* componentDidMount() {
        this.setState({ updatedPlaces: places });
    } */
    fetchResults(e) {
        e.preventDefault();
        const updatePlace = e.target.value;
        this.setState({ place: updatePlace });
        // get the data from the server and pop into 

        updatePlace !== "" ? this.setState({ updatedPlaces: this.fetchPlacesNearBy(this.state.place) }) : this.setState({ updatedPlaces: [] });
    };
    fetchPlacesNearBy(place) {
        const fetchedPlaces = places;
        return fetchedPlaces;
    }
    onCommonCityClicked(city) {
        this.setState({ place: city });
        this.setState({ updatedPlaces: this.fetchPlacesNearBy(this.state.place) })
        // fetch the places near by
    }
    DisplayCities = () =>
        <div>
            {this.state.commonCities.map((city, index) => {
                return <button onClick={() => this.onCommonCityClicked(city)} key={index} >{city}</button>
            })}</div>
    DisplayPlaces = () =>
        <div><h2>Choose the list of places</h2>{
            this.state.updatedPlaces.map((place, index) => {
                return <button key={index}>{place.name}</button>
            })}</div>
    render() {
        return (
            <div>

                <h2>Look into places near by</h2>
                <input className="inputPlace" placeholder="Enter a Destination" onChange={this.fetchResults.bind(this)} />
                {this.state.place ? <h1>The City You Chose: {this.state.place}</h1> : ""}
                {this.state.updatedPlaces.length > 0 ? <this.DisplayPlaces /> : <this.DisplayCities />}
            </div>
        );
    }
}

export default Place;