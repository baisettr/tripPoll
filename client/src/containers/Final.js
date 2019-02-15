import React, { Component } from 'react';
import axios from 'axios';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import AirbnbTest from '../components/AirbnbComponent';
import GoogleTest from '../components/GoogleComponent';
import { Link, withRouter } from 'react-router-dom';

const styles = {
    divHome: {
        backgroundColor: "rgba(255, 255, 255)",
        textAlign: 'center',
        marginTop: '15px'
    }
}

class Final extends Component {
    constructor(props) {
        super(props);
        const tripId = props.location.search.split('=')[1];
        this.state = { error: '', users: [], finalTrip: {}, userId: "8906", tripId: tripId, tripOId: '', activeStep: 0, destination: "", userSelection: {}, tripSelectedOptions: {}, selectedDays: [], listAirbnbPlaces: [], listGooglePlaces: [], selectedGooglePlaces: {}, selectedAirbnbPlaces: {}, userOtherOptions: { userShare: 0, userHasCar: 0, userCarFit: 0 } };
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const queryParams = {};
        for (let param of query.entries()) {
            queryParams[param[0]] = param[1];
        }
        const tripId = queryParams["tripId"];
        if (tripId) {
            this.setState({ tripId, activeStep: 3 });
            this.getTripDetails(tripId);
        }
    }

    finalize = async (tripSel, tripListGooglePlaces, tripListAirbnbPlaces) => {
        let finalTrip = { selectedGooglePlaces: {}, selectedAirbnbPlaces: {}, selectedDays: {}, userShare: 0, userHasCar: 0, userCarFit: 0 }
        const f_sort = (sel) => { let y = Object.keys(sel); return y.sort((a, b) => sel[b] - sel[a]) };
        const f_map = (selPlace, sel) => { let selList = sel.length ? sel : Object.keys(sel); selList.map((s) => { if (!selPlace[s]) { selPlace[s] = 0; }; selPlace[s] += 1; }) };
        let users = Object.keys(tripSel);

        users.map((s) => {
            f_map(finalTrip.selectedGooglePlaces, tripSel[s].selectedGooglePlaces);
            f_map(finalTrip.selectedAirbnbPlaces, tripSel[s].selectedAirbnbPlaces);
            f_map(finalTrip.selectedDays, tripSel[s].selectedDays);
            finalTrip.userShare += Number(tripSel[s].userOtherOptions.userShare);
            if (tripSel[s].userOtherOptions.userHasCar) { finalTrip.userHasCar += 1 };
            finalTrip.userCarFit += Number(tripSel[s].userOtherOptions.userCarFit);
        });
        let topSelectedGooglePlaces = f_sort(finalTrip.selectedGooglePlaces);
        let topSelectedAirbnbPlaces = f_sort(finalTrip.selectedAirbnbPlaces);
        let topSelectedDays = f_sort(finalTrip.selectedDays);
        let userOtherOptions = { userShare: finalTrip.userShare, userHasCar: finalTrip.userHasCar, userCarFit: finalTrip.userCarFit }
        console.log(finalTrip);
        let selectedGooglePlaces = {};
        let listGooglePlaces = [];
        for (const i in topSelectedGooglePlaces) {
            const place = tripListGooglePlaces[i];
            selectedGooglePlaces[place.id] = 1;
            listGooglePlaces.push(place);
        };
        let listAirbnbPlaces = [];
        let selectedAirbnbPlaces = {};
        for (const i in topSelectedAirbnbPlaces) {
            const room = tripListAirbnbPlaces[i];
            selectedAirbnbPlaces[room.id] = 1;
            listAirbnbPlaces.push(room);
        };
        this.setState({ finalTrip, users, selectedDays: topSelectedDays, selectedGooglePlaces, selectedAirbnbPlaces, listGooglePlaces, listAirbnbPlaces, userOtherOptions });
    }

    getTripDetails = async (tripId) => {
        const userToken = localStorage.userToken;
        const headers = { Authorization: 'Bearer ' + userToken };
        const url = '/trip?tripId=' + tripId;
        axios.get(url, { headers }
        ).then((res) => {
            const trip = res.data;
            const { _id, tripDestination, tripListGooglePlaces, tripListAirbnbPlaces, tripSelectedOptions } = trip;
            this.finalize(tripSelectedOptions, tripListGooglePlaces, tripListAirbnbPlaces);
            this.setState({ activeStep: 1, tripOId: _id.$oid, destination: tripDestination, tripSelectedOptions });
        }).catch((error) => {
            const message = error.response.data.message;
            this.setState({ error: message, activeStep: 0 })
        });
    }

    getTripDetailsFromUserInput = (e) => {
        e.preventDefault();
        this.setState({ activeStep: 3 });
        const tripId = this.state.tripId;
        this.getTripDetails(tripId);
    }

    FinalHomeComponent = () =>
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

    handleDayClick(day, { selected }) {
        const { selectedDays } = this.state.selectedDays;
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
            <h6>Trip Dates selected!</h6>
            <br />
            <DayPicker selectedDays={this.state.selectedDays.map((day) => new Date(day))}
                disabledDays={{ before: new Date() }} onDayClick={this.handleDayClick.bind(this)}
            />
        </div>

    ShareAndCarComponent = () =>
        <div>
            <h6>Trip Share and Car Details</h6>
            <br />
            <label style={{ paddingRight: '10px' }}>Total share for the Trip (in $)</label>
            <input className="inputShare inputPlace" placeholder="Enter a Share Amount in $" required={true} type="number" defaultValue={this.state.userOtherOptions.userShare}
                onChange={(e) => {
                    const { userOtherOptions } = this.state;
                    userOtherOptions.userShare = e.target.value;
                    this.setState({ userOtherOptions });
                }} />
            <br />
            <div >
                <label style={{ paddingRight: '15px' }}>People with Cars</label>
                <input className="inputShare inputPlace" placeholder="User car" required={true} type="number" defaultValue={this.state.userOtherOptions.userHasCar}
                    onChange={(e) => {
                        const { userOtherOptions } = this.state;
                        userOtherOptions.userHasCar = e.target.value;
                        this.setState({ userOtherOptions });
                    }} />
            </div>
            <br />
            {this.state.userOtherOptions.userHasCar ?
                <div>
                    <label style={{ paddingRight: '10px' }}>People can accomodate</label>
                    <input className="inputCarSeating inputPlace" placeholder="How many people you can accomodate?" required={true} type="number" defaultValue={this.state.userOtherOptions.userCarFit}
                        onChange={(e) => {
                            const { userOtherOptions } = this.state;
                            userOtherOptions.userCarFit = e.target.value;
                            this.setState({ userOtherOptions });
                        }} />
                </div> : ""}

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

    TripHomeComponent = () =>
        <div>
            <h6>Trip Details</h6>
            <br />
            <div>
                <label>Destination : {this.state.destination}</label>
            </div>
            <div>
                <label>Trip Owner : {this.state.userId} </label>
                <br />
                <label>Other Listed Trip Friends </label>
                {this.state.users.map((u, index) => <h6 key={index}>{u}</h6>)}
            </div>
        </div>

    generateTripOptions = () => {
        const finalSelection = { selectedGooglePlaces: this.state.selectedGooglePlaces, selectedAirbnbPlaces: this.state.selectedAirbnbPlaces, selectedDays: this.state.selectedDays, userOtherOptions: this.state.userOtherOptions };
        this.saveTripOptions(finalSelection);
    }

    saveTripOptions = (tripOptions) => {
        const url = '/tripFinal';
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

    FinalizeComponent = () => <div>
        <button className="btn btn-dark" onClick={() => {
            this.generateTripOptions();
            this.setState({ activeStep: 2 })
        }}>Finalize</button>
    </div>


    DisplayTripDetails = () =>
        <div>
            <div className="grid-container-view">
                <this.TripHomeComponent />
                <this.DateComponent />
                <this.ShareAndCarComponent />
            </div>
            <br /><br />
            <GoogleTest status={true} destination={this.state.destination} listGooglePlaces={this.state.listGooglePlaces} selectedGooglePlaces={this.state.selectedGooglePlaces} handleGoogleClick={this.handleGoogleClick} />
            <br /><br /><br />
            <AirbnbTest status={true} destination={this.state.destination} listAirbnbPlaces={this.state.listAirbnbPlaces} selectedAirbnbPlaces={this.state.selectedAirbnbPlaces} handleAirbnbClick={this.handleAirbnbClick} />
            <br /><br />
            <this.FinalizeComponent />
        </div>

    TripSuccessComponent = () =>
        <div>
            <h4>Trip Finalized... Options Saved Successful!</h4>
            <br />
        </div>

    SpinComponent = () => <div className='Loader'>Loading...</div>

    switchComponent = (e) => {
        switch (e) {
            case 0: return <this.FinalHomeComponent />
            case 1: return <this.DisplayTripDetails />
            case 2: return <this.TripSuccessComponent />
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

export default withRouter(Final);