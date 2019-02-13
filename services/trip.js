const axios = require('axios');
const keys = require('../config/keys');

function saveNewTrip(tripDetails) {
    return new Promise((resolve, reject) => {

        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=' + keys.mlabAPIKey;
        axios.post(url, tripDetails)
            .then((res) => {
                //console.log(res.data);
                resolve(res.data);
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function getTrip(tripId) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=' + keys.mlabAPIKey + '&q={"tripId":' + tripId + '}';
        axios.get(url)
            .then((res) => {
                if (res.data.length) {
                    resolve(res.data[0]);
                } else {
                    reject("Invalid Trip. Please check and try again!");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function saveTripOptions(tripId, tripOptions) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips/' + tripId + '?apiKey=' + keys.mlabAPIKey;
        axios.put(url, { "$set": { "tripSelectedOptions": tripOptions } })
            .then((res) => {
                //console.log(res.data);
                resolve(res.data);
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function saveFinalTrip(tripId, tripOptions) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips/' + tripId + '?apiKey=' + keys.mlabAPIKey;
        axios.put(url, { "$set": { "finalTrip": tripOptions } })
            .then((res) => {
                //console.log(res.data);
                resolve(res.data);
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function getMyTrips(userDetails) {
    return new Promise((resolve, reject) => {
        const userId = userDetails.userId;
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=' + keys.mlabAPIKey + '&q={"tripOwnerId":' + JSON.stringify(userId) + '}&f={"tripId":1,"tripDestination":1}';
        axios.get(url)
            .then((res) => {
                if (res.data) {
                    resolve(res.data);
                } else {
                    reject("Invalid Trip. Please check and try again!");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function getFriendTrips(userDetails) {
    return new Promise((resolve, reject) => {
        const userId = userDetails.userId;
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=' + keys.mlabAPIKey + '&q={"tripSelectedOptions":' + userId + '}';
        axios.get(url)
            .then((res) => {
                if (res.data) {
                    resolve(res.data);
                } else {
                    reject("Invalid Trip. Please check and try again!");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

module.exports = { saveNewTrip, getTrip, saveTripOptions, saveFinalTrip, getMyTrips, getFriendTrips };
