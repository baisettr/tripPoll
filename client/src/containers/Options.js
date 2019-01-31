import React, { Component } from 'react';
import axios from 'axios';

class Options extends Component {
    constructor(props) {
        super(props); this.state = { tripId: "", place: "", selectedList: {}, selectedDates: [], selectedListings: [], updatedPlaces: [], updatedDates: [], updatedListings: [], trip: {}, user: "", userShare: "", userCar: false, tripSId: "", tripOptions: [], flag: true };
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


            this.setState({ updatedPlaces: trip.cityPlaces, updatedDates: trip.tripDays, updatedListings: trip.airbnbPlaces, selectedList: selList, place: trip.city, tripSId: trip._id.$oid, tripOptions: trip.options, trip: trip, user: trip.owner, selectedDates: selDateList, selectedListings: selAirList });
        }).catch((error) => {
            console.log(error);
        });
    }


    DisplayRow = (data) => {
        let x = [];
        let y = data.props;
        for (let i in y) {
            {
                x.push(<td key={i}><input type="checkbox" checked={y[i]} readOnly /></td>);
            }
        }
        return x;
    }
    DisplayHeader = () => {
        return <tr>
            <td><h4>User</h4></td>
            {this.state.updatedPlaces.map((place, index) => {
                return <td key={index}><h4>{place.name}</h4></td>
            })}
            <td><h4>User Selected Dates</h4></td>
            <td><h4>User Selected Listings</h4></td>
            <td><h4>User Share</h4></td>
            <td><h4>User Has a Car</h4></td>
        </tr>
    }
    DisplayReport = () => this.state.tripOptions.map((opt, index) => {
        let selDateList = [];
        this.state.updatedDates.map((d, i) => {
            if (opt.selDays[i]) {
                selDateList.push(d.split('T')[0]);
            }
            return ""
        })
        let selListingsList = []
        this.state.updatedListings.map((l, i) => {
            if (opt.selListings[i]) {
                selListingsList.push(l.name);
            }
            return ""
        });

        return <tr key={opt.user}>
            <td>{opt.user}</td>
            <this.DisplayRow props={opt.selPlaces} />
            <td>{selDateList.join(',\n')}</td>
            <td>{selListingsList.join(',\n')}</td>
            <td>{'$' + opt.userShare}</td>
            <td>{opt.userCar ? 'Yes' : 'No'}</td>
        </tr>
    })

    onChange(key, value) {
        const changedValue = {};
        changedValue[key] = value;
        const selUpdatedList = { ...this.state.selectedList, ...changedValue };
        this.setState({ selectedList: selUpdatedList });
    }

    DisplayGroup = () => {
        return <div className="list-group-item form-group">
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
    }

    onChangeDate(key, value) {
        const changedValue = {};
        changedValue[key] = value;
        const selUpdatedDateList = { ...this.state.selectedDates, ...changedValue };
        this.setState({ selectedDates: selUpdatedDateList });
    }

    DisplayDateGroup = () => <div className="list-group-item form-group">
        {this.state.updatedDates.map((date, index) => (
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

    SelectionDisplay = () => <form onSubmit={this.finalSelection}>

        <h4><label>Finalize the Trip Places</label></h4>
        <br />
        <this.DisplayGroup />
        <br />
        <label>Finalize the Dates</label>
        <br /><br />
        <this.DisplayDateGroup />
        <br />
        <label>Finalize the Housing options</label>
        <br /><br />
        <this.DisplayListingGroup />
        <br />
        <label>Finalize the Trip Share</label>
        <input type="number" className="form-control" name="userShare" onChange={(e) => { this.setState({ userShare: e.target.value }) }} placeholder="User Share for the Trip" required={true} />
        <br />
        <label style={{ paddingRight: '10px' }}>Finalize Car Options?</label>
        <label>
            <input type="radio" value="yes" onClick={(e) => { this.setState({ userCar: true }) }} />Yes
        </label>
        <br /><br />
        <label>The owner of the Trip : {this.state.user}</label>
        <br /><br />
        <button className="btn btn-primary">Save</button>
    </form>

    DivDisplay = () => this.state.flag ? <this.SelectionDisplay /> : <h4><label bsStyle="warning">Options Saved Successfully</label></h4>


    finalSelection = (e) => {
        e.preventDefault();
        const saveData = { selPlaces: this.state.selectedList, selDays: this.state.selectedDates, selListings: this.state.selectedListings, userShare: this.state.userShare, userCar: this.state.userCar };
        this.updateToDb(saveData);
        console.log(saveData);
    }

    updateToDb = (data) => {
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips/' + this.state.tripSId + '?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ';
        axios.put(url, { "$set": { "finalTrip": data } }
        ).then((res) => {
            console.log("Updated");
            this.setState({ flag: false });
        }).catch((error) => {
            console.log(error);
        });
    }

    DisplayFinalReport = () => {
        let x = [];
        let y = this.state.selectedList;
        for (let i in y) {
            {
                x.push(<td key={i}><input type="checkbox" checked={y[i]} readOnly />{i}</td>);
            }
        }
        return <div><h4><label>Options Saved Successfully</label></h4><br /><table><tbody><tr>{x}</tr></tbody></table></div>;
    }

    render() {
        return (
            <div style={{ display: "inline" }}>
                <button className="btn btn-link" onClick={() => this.props.history.goBack()}>Go Back</button>
                <div>
                    <h2><label bsStyle="success">Destination : {this.state.place}</label></h2>
                    <table>
                        <thead>
                            <this.DisplayHeader />
                        </thead>
                        <tbody>
                            <this.DisplayReport />
                        </tbody>
                    </table>
                </div>
                <div className="container jumbotron">
                    <this.DivDisplay />
                </div>
            </div>
        );
    }
}

export default Options;