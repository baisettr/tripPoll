import React from 'react';

const AirbnbPlacesComponent = (props) => {
    const destination = props.destination;
    const listAirbnbPlaces = props.listAirbnbPlaces;
    const selectedAirbnbPlaces = props.selectedAirbnbPlaces;

    const airbnbRoomSearchHandler = (roomId) => {
        const url = 'https://www.airbnb.com/rooms/' + roomId + '?guests=1&adults=1';
        window.open(url, '_blank', 'height=500,width=1400');
    }

    return (
        <div>
            <h4>Choose the list of Airbnb accomodations! {destination}</h4>
            <br />
            <div className="grid-container">
                {listAirbnbPlaces.map((lis, index) => (
                    <div id="airbnbGrid" className={selectedAirbnbPlaces[lis.id] === 1 ? "card grid-item-selected" : "card grid-item"} key={index} onClick={props.handleAirbnbClick.bind(this, lis)}>
                        <img className="card-img-top" src={lis.thumb} alt="" />
                        <h6 className="">{lis.name} </h6>
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