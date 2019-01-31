import React, { Component } from 'react';
import axios from 'axios';

class Select extends Component {
    constructor(props) {
        super(props);
        this.state = { tripId: "", place: "", updatedPlaces: [], selectedList: {}, user: "", userShare: "", userCar: false, tripSId: "", oldOptions: [], trip: {}, flag: true, updatedDays: [], updatedListings: [], selectedDates: [], selectedListings: [] };
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
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ&q={"tripId":' + tripId + '}';
        axios.get(url,
        ).then((res) => {
            const trip = res.data[0];
            const selList = {}
            trip.cityPlaces.map((e) => {
                selList[e.id] = false;
                return ""
            });

            const selDateList = {}
            trip.tripDays.map((e, index) => {
                selDateList[index] = false;
                return ""
            });

            const selAirList = {}
            trip.airbnbPlaces.map((e, index) => {
                selAirList[index] = false;
                return ""
            });

            this.setState({ updatedPlaces: trip.cityPlaces, selectedList: selList, updatedDays: trip.tripDays, updatedListings: trip.airbnbPlaces, place: trip.city, owner: trip.owner, tripSId: trip._id.$oid, oldOptions: trip.options, selectedDates: selDateList, selectedListings: selAirList });
        }).catch((error) => {
            console.log(error);
        });
    }

    /* DisplayPlaces = () => <tr>{
        this.state.updatedPlaces.map((place, index) => {
            return <td key={place.id}><input type="checkbox" value={place.id} />{place.name}</td>
        })}</tr> */

    onChange(key, value) {
        const changedValue = {};
        changedValue[key] = value;
        const selUpdatedList = { ...this.state.selectedList, ...changedValue };
        this.setState({ selectedList: selUpdatedList });
    }

    DisplayGroup = () => <div className="list-group-item form-group">
        {this.state.updatedPlaces.map((place, index) => (
            <div className="checkbox" key={index}>
                <label>
                    <input
                        onChange={(e) => this.onChange(place.id, e.target.checked)}
                        type='checkbox' style={{ marginTop: '11px' }}
                        value={this.state.selectedList[place]}
                    />
                    <button className="btn btn-link" onClick={(e) => {
                        e.preventDefault();
                        const url = 'https://google.com/search?q=' + place.name;
                        window.open(url, '_blank', 'height=500,width=1400');
                    }}>{place.name}</button>
                </label>
            </div>
        ))}
    </div>

    onChangeDate(key, value) {
        const changedValue = {};
        changedValue[key] = value;
        const selUpdatedDateList = { ...this.state.selectedDates, ...changedValue };
        this.setState({ selectedDates: selUpdatedDateList });
    }

    DisplayDateGroup = () => <div className="list-group-item form-group">
        {this.state.updatedDays.map((date, index) => (
            <div className="checkbox" key={index}>
                <label>
                    <input
                        onChange={(e) => this.onChangeDate(index, e.target.checked)}
                        type='checkbox'
                        value={this.state.selectedDates[index]}
                    />
                    {date}
                </label>
            </div>
        ))}
    </div>

    onChangeListing(key, value) {
        const changedValue = {};
        changedValue[key] = value;
        const selUpdatedLisList = { ...this.state.selectedListings, ...changedValue };
        this.setState({ selectedListings: selUpdatedLisList });
    }

    DisplayListingGroup = () => <div className="list-group-item form-group">
        {this.state.updatedListings.map((lis, index) => (
            <div className="checkbox" key={index}>
                <label>
                    <input
                        onChange={(e) => this.onChangeListing(index, e.target.checked)}
                        type='checkbox'
                        value={this.state.selectedListings[index]}
                    />
                    {lis.name + ", Price : "} <b>{'$' + lis.price}</b>
                </label>
            </div>
        ))}
    </div>

    saveSelection = (e) => {
        e.preventDefault();
        //const newSelection = { "options": [{ user: this.state.user, selPlaces: this.state.selectedList }] };
        const newSelection = { user: this.state.user, selPlaces: this.state.selectedList, selListings: this.state.selectedListings, selDays: this.state.selectedDates, userShare: this.state.userShare, userCar: this.state.userCar };
        const saveData = [...this.state.oldOptions, newSelection];
        //const data = JSON.stringify(saveData);
        this.updateToDb(saveData);
    }

    updateToDb = (data) => {
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips/' + this.state.tripSId + '?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ';
        axios.put(url, { "$set": { "options": data } }
        ).then((res) => {
            console.log("Updated");
            this.setState({ flag: false });
        }).catch((error) => {
            console.log(error);
        });
    }

    SelectionDisplay = () => <form onSubmit={this.saveSelection}>
        <label>Enter Your Name</label>
        <input className="form-control" name="userName" onChange={(e) => { this.setState({ user: e.target.value }) }} placeholder="User Name" required={true} />
        <br />
        <label>Choose the interested near by places from the list</label>
        <br /><br />
        <this.DisplayGroup />
        <br />
        <label>Choose the listed available dates</label>
        <br /><br />
        <this.DisplayDateGroup />
        <br />
        <label>Choose the listed housing options</label>
        <br /><br />
        <this.DisplayListingGroup />
        <br />
        <label>Enter Your Share for the Trip</label>
        <input type="number" className="form-control" name="userShare" onChange={(e) => { this.setState({ userShare: e.target.value }) }} placeholder="User Share for the Trip" required={true} />
        <br />
        <label style={{ paddingRight: '10px' }}>Do you have a Car?</label>
        <label>
            <input type="radio" value="yes" onClick={(e) => { this.setState({ userCar: true }) }} />Yes
        </label><br />
        <button className="btn btn-primary">Save</button>
    </form>

    DivDisplay = () => this.state.flag ? <this.SelectionDisplay /> : <h4><label bsStyle="warning">Options Saved Successfully</label></h4>



    render() {
        return (
            <div style={{ display: "inline" }}>
                <button className="btn btn-link" onClick={() => this.props.history.goBack()}>Go Back</button>
                <div className="container jumbotron">
                    <h2><label bsStyle="success">Destination : {this.state.place}</label></h2>
                    <br />
                    <this.DivDisplay />
                </div>
            </div>
        );
    }
}

export default Select;


//mongodb+srv://tripo:<PASSWORD>@cluster0-vqpsm.gcp.mongodb.net/test?retryWrites=true
//https://maps.googleapis.com/maps/api/place/textsearch/json?query=san+francisco+tourist&language=en&key=AIzaSyDiFYXE3HoT8ux5MqVFaeYLDLQcZvhAqqs