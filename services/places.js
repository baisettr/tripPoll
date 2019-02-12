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
                resolve(res.data);
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

module.exports = { getPlaceSuggestions, getPlaces, getListings };
