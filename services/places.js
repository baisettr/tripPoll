const axios = require('axios');
const request = require('request');
const keys = require('../config/keys');

function getPlaceSuggestions(destination) {
    return new Promise((resolve, reject) => {

        const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + destination + '&types=geocode&key=' + keys.googleAPIKey;
        axios.get(url)
            .then((res) => {
                //console.log(res.data);
                const pred = res.data.predictions;
                const desc = pred.map((e) => e.description);
                resolve(desc);
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function getPlaces(destination) {
    return new Promise((resolve, reject) => {
        const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + destination + '+tourist+attractions&language=en&key=' + keys.googleAPIKey;
        axios.get(url)
            .then((res) => {
                getPlaceUrl(res.data.results)
                    .then((googlePlaces) => {
                        resolve(googlePlaces);
                    })
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function getPlaceUrl(places) {
    return new Promise((resolve, reject) => {
        const googlePlaces = places;
        let urls = [];
        let indices = [];
        googlePlaces.forEach((e, index) => {
            if (e.photos) {
                let reference = e.photos[0].photo_reference;
                let url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=639&maxheight=426&photoreference=" + reference + "&key=AIzaSyDiFYXE3HoT8ux5MqVFaeYLDLQcZvhAqqs";
                urls.push(axios.get(url))
            } else {
                indices.push(index);
            }
        })

        if (indices.length) {
            indices.forEach((i) => {
                googlePlaces.splice(i, 1);
            })
        }


        axios.all(urls)
            .then(axios.spread(function () {
                for (e in arguments) {
                    googlePlaces[e]["photoUrl"] = arguments[e].request.res.responseUrl;
                }
                resolve(googlePlaces);
            }))
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}


function getRestaurants(destination) {
    return new Promise((resolve, reject) => {
        const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=best+places+to+eat+' + destination + '&language=en&key=' + keys.googleAPIKey;
        axios.get(url)
            .then((res) => {
                getPlaceUrl(res.data.results)
                    .then((restaurants) => {
                        resolve(restaurants);
                    })
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function getListings(destination) {
    return new Promise((resolve, reject) => {
        const headers = {
            'cache-control': 'no-cache',
            'user-agent': 'Airbnb/17.50 iPad/11.2.1 Type/Tablet',
            'content-type': 'application/json',
            'accept': 'application/json',
            'accept-language': 'en-us',
            'x-airbnb-api-key': keys.airbnbAPIKey,
            'x-airbnb-locale': 'en',
            'x-airbnb-currency': 'USD',
        };

        const options = {
            method: 'GET',
            url: 'https://api.airbnb.com/v2/search_results/',
            headers: headers,
            qs: {
                '_limit': 12,
                '_offset': 0,
                'locale': 'en-US',
                'location': destination,
            }
        };

        request(options, function (error, res) {
            if (error) {
                reject("Internal error. Please try again!");
            } else {
                const listings = JSON.parse(res.body);
                resolve(listings);
            }
        });
    });
}

module.exports = { getPlaceSuggestions, getPlaces, getRestaurants, getListings };
