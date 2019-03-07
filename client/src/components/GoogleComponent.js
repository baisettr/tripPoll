import React from 'react';

const GooglePlacesComponent = (props) => {
    const destination = props.destination;
    const listGooglePlaces = props.listGooglePlaces;
    const selectedGooglePlaces = props.selectedGooglePlaces;

    const googlePlaceSearchHandler = (place) => {
        const url = 'https://google.com/search?q=' + place + ', ' + destination;
        window.open(url, '_blank', 'height=500,width=1400');
    }

    return (
        <div>
            {props.status ? <h6>Top list of interesting tourist attractions selected! {destination}</h6> : <h4>Choose the list of interesting tourist attractions! {destination}</h4>}
            <br />
            <div className="grid-container">
                {listGooglePlaces.map((place, index) => (
                    <div id="googleGrid" className={selectedGooglePlaces[place.id] === 1 ? "card grid-item-selected" : "card grid-item"} key={index} onClick={props.handleGoogleClick.bind(this, place)}>
                        <img className="card-img-top" src={place.photoUrl} alt="" height="150" />
                        <h6>{place.name} {' '}
                            <a style={{ fontSize: '13px' }} className="btn-link" href='/#' onClick={googlePlaceSearchHandler.bind(this, place.name)}>More...</a>
                        </h6>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default GooglePlacesComponent;