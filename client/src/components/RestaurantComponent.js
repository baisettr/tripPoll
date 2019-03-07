import React from 'react';

const RestaurantComponent = (props) => {
    const destination = props.destination;
    const listRestaurants = props.listRestaurants;
    const selectedRestaurants = props.selectedRestaurants;

    const restaurantSearchHandler = (restaurant) => {
        const url = 'https://google.com/search?q=' + restaurant + ', ' + destination;
        window.open(url, '_blank', 'height=500,width=1400');
    }

    return (
        <div>
            {props.status ? <h6>Top list of restaurants selected! {destination}</h6> : <h4>Choose the list of best restaurants to eat! {destination}</h4>}
            <br />
            <div className="grid-container">
                {listRestaurants.map((restaurant, index) => (
                    <div id="restaurantGrid" className={selectedRestaurants[restaurant.id] === 1 ? "card grid-item-selected" : "card grid-item"} key={index} onClick={props.handleRestaurantClick.bind(this, restaurant)}>
                        <img className="card-img-top" src={restaurant.photoUrl} alt="" height="150" />
                        <h6>{restaurant.name} {' '}
                            <a style={{ fontSize: '13px' }} className="btn-link" href='/#' onClick={restaurantSearchHandler.bind(this, restaurant.name)}>More...</a>
                        </h6>
                        <h6 style={{ display: "inherit", margin: "auto" }}><span style={{ color: "#e7711b", paddingRight: "5px" }}>{restaurant.rating} </span> {[1, 2, 3, 4, 5].map((e, index) => { if (Math.round(restaurant.rating) >= e) { return <span style={{ color: "#e7711b" }} key={index}>★</span> } else { return <span style={{ color: "black" }} key={index}>★</span> } })}<span style={{ color: "grey", paddingLeft: "5px" }}>({restaurant.user_ratings_total})</span></h6>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default RestaurantComponent;