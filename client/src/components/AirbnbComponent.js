import React from 'react';

const AirbnbPlacesComponent = (props) => {
    const destination = props.destination;
    const listAirbnbPlaces = props.listAirbnbPlaces;
    const selectedAirbnbPlaces = props.selectedAirbnbPlaces;
    const showUpVotes = props.showUpVotes;
    const showSelection = props.showSelection;
    const userName = props.tripOwnerUserName;

    const showSelectedAirbnbPlaces = props.showSelectedAirbnbPlaces;

    const airbnbRoomSearchHandler = (roomId) => {
        const url = 'https://www.airbnb.com/rooms/' + roomId + '?guests=1&adults=1';
        window.open(url, '_blank', 'height=500,width=1400');
    }

    return (
        <div>
            {props.status ? <h6>Select one of the top list of Airbnb accomodations selected! {destination}</h6> : <h4>Select multiple feasible options to have a stay from the list of Airbnb accomodations. {destination}{showSelection ? <h6>Outlined accomodations suggested by : {userName}</h6> : ""}</h4>}
            <br />
            <div className="grid-container">
                {listAirbnbPlaces.map((lis, index) => (
                    <div id="airbnbGrid" className={selectedAirbnbPlaces[lis.id] === 1 ? "card grid-item-selected" : "card grid-item"} key={index} onClick={props.handleAirbnbClick.bind(this, lis)}>
                        <img className="card-img-top" src={lis.thumb} alt="" />
                        <h6 className="">{lis.name} {' '} {showUpVotes ? <span>(<span style={{ color: 'green' }}>{showSelectedAirbnbPlaces[lis.id]}⯅</span>)</span> : ""}{' '}</h6>
                        <h6>${lis.price} per night{' '}
                            <a style={{ fontSize: '13px' }} className="btn-link" href='/#' onClick={airbnbRoomSearchHandler.bind(this, lis.id)}>More...</a>
                        </h6>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default AirbnbPlacesComponent;