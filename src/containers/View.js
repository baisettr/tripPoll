import React, { Component } from 'react';
import axios from 'axios';
import { Label } from 'react-bootstrap';

class View extends Component {
    constructor(props) {
        super(props);
        this.state = { tripId: "", place: "", updatedPlaces: [], selUrl: "", optUrl: "", selectedList: {}, owner: "", flag: true, error: "", open: false, activeItemName: "", activeItemId: null, updatedDays: [], updatedListings: [], selectedDates: [], selectedListings: [], userShare: "", userCar: "" };
    }
    componentDidMount() {

    }
    getTripDetails = (tripId) => {
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ&q={"tripId":' + tripId + '}';
        axios.get(url,
        ).then((res) => {
            if (res.data.length) {
                const trip = res.data[0];
                let selList = {};
                let selDateList = {};
                let selAirList = {};
                let userShare = "N/A";
                let userCar = "Not Yet Decided";
                if (!trip.finalTrip) {
                    trip.cityPlaces.map((e) => {
                        selList[e.id] = false;
                        return ""
                    });

                    trip.tripDays.map((e, index) => {
                        selDateList[index] = false;
                        return ""
                    });

                    trip.airbnbPlaces.map((e, index) => {
                        selAirList[index] = false;
                        return ""
                    });
                }
                else {
                    selList = trip.finalTrip.selPlaces;
                    selDateList = trip.finalTrip.selDays;
                    selAirList = trip.finalTrip.selListings;
                    userShare = trip.finalTrip.userShare;
                    userCar = trip.finalTrip.userCar;
                }
                const selUrl = '/select?tripId=' + tripId;
                const optUrl = '/options?tripId=' + tripId;
                this.setState({ updatedPlaces: trip.cityPlaces, updatedDays: trip.tripDays, updatedListings: trip.airbnbPlaces, selectedDates: selDateList, selectedListings: selAirList, selectedList: selList, place: trip.city, owner: trip.owner, userShare: userShare, userCar: userCar, flag: false, selUrl: selUrl, optUrl: optUrl });
            }
            else {
                this.setState({ error: "Please enter a valid trip ID!" })
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    DisplayLinks = () => <div>
        <div>
            <div><Label>Link to Share : <span>{'localhost:3000' + this.state.selUrl}</span></Label></div>
            <button className="btn btn-link" onClick={() => this.props.history.push(this.state.selUrl)}> Click to Preview</button>
        </div>
        <div>
            <div><Label>Link to View Options : <span>{'localhost:3000' + this.state.optUrl}</span></Label></div>
            <button className="btn btn-link" onClick={() => this.props.history.push(this.state.optUrl)}> Click to See Options</button>
        </div>
    </div>

    /* onOpenModal = (place) => {
        //e.preventDefault();
        this.setState({ open: true, activeItemName: place.name, activeItemId: place.id });
    };

    onCloseModal = () => {
        //e.preventDefault();
        this.setState({ open: false });
    };

    ModalComponent = () => <div><button className="btn btn-link" onClick={(e) => { e.preventDefault(); this.onOpenModal(place) }}>{place.name}</button>
        <Modal open={this.state.open} onClose={(e) => { e.preventDefault(); this.onCloseModal() }} center
            styles={{
                "overlay": {
                    background: 'rgba(255,255,255,0.3)'
                }
            }}>
            <h2>{this.state.activeItemName}</h2>
        </Modal></div> */

    DisplayGroup = () => <div className="list-group-item form-group">
        {this.state.updatedPlaces.map((place, index) => (
            <div className="finalTrip" key={index}>
                <label>
                    <input
                        type='checkbox'
                        checked={this.state.selectedList[place.id]}
                        readOnly
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

    DisplayDateGroup = () => <div className="list-group-item form-group">
        {this.state.updatedDays.map((date, index) => (
            <div className="checkbox" key={index}>
                <label>
                    <input
                        type='checkbox'
                        checked={this.state.selectedDates[index]}
                        readOnly
                    />
                    {date}
                </label>
            </div>
        ))}
    </div>


    DisplayListingGroup = () => <div className="list-group-item form-group">
        {this.state.updatedListings.map((lis, index) => (
            <div className="checkbox" key={index}>
                <label>
                    <input
                        type='checkbox'
                        checked={this.state.selectedListings[index]}
                        readOnly
                    />
                    {lis.name + ", Price : "} <b>{'$' + lis.price}</b>
                </label>
            </div>
        ))}
    </div>

    SelectionDisplay = () => <form onSubmit={this.saveSelection}>
        <h2><Label bsStyle="success">Destination : {this.state.place}</Label></h2>
        <br />
        <label>Trip Organizer : {this.state.owner}</label>
        <br /><br />
        <h4><Label>List of Near By Places Selected</Label></h4>
        <br />
        <this.DisplayGroup />
        <br />
        <h4><Label>List of Dates Selected</Label></h4>
        <br />
        <this.DisplayDateGroup />
        <br />
        <h4><Label>List of Housing Options Selected</Label></h4>
        <br />
        <this.DisplayListingGroup />
        <br />
        <h4><Label>Trip Share Per Person : <b>{'$' + this.state.userShare}</b> </Label></h4>
        <br />
        <h4><Label>Travel option for the Trip via Car : <b>{this.state.userCar ? 'Yes' : 'No'}</b></Label></h4>
        <br />
        <this.DisplayLinks />
        <br />
    </form>

    DivDisplay = () => this.state.flag ? <this.TripIDForm /> : <div>{!this.state.error ? <this.SelectionDisplay /> : <Label>{this.state.error}</Label>}</div>

    TripIDForm = () => <form onSubmit={this.fetchTripDetails}>
        <label>Enter Trip Id</label>
        <input className="form-control" name="tripId" onChange={(e) => { this.setState({ tripId: e.target.value }) }} placeholder="Trip Id" required={true} />
        <br />
        <button className="btn btn-primary">Fetch Details</button>
    </form>

    fetchTripDetails = (e) => {
        e.preventDefault();
        const tripId = this.state.tripId;
        this.getTripDetails(tripId);
    }

    render() {
        return (
            <div style={{ display: "inline" }}>
                <button className="btn btn-link" onClick={() => this.props.history.goBack()}>Go Back</button>
                <div className="container jumbotron">
                    <this.DivDisplay />
                </div>
            </div>
        );
    }
}

export default View;


//mongodb+srv://tripo:<PASSWORD>@cluster0-vqpsm.gcp.mongodb.net/test?retryWrites=true
//https://maps.googleapis.com/maps/api/place/textsearch/json?query=san+francisco+tourist&language=en&key=AIzaSyDiFYXE3HoT8ux5MqVFaeYLDLQcZvhAqqs