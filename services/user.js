const axios = require('axios');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

function userSignUp(userDetails) {
    return new Promise((resolve, reject) => {

        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey;
        const userSaveDetails = userDetails
        bcrypt.hash(userDetails.userPassword, saltRounds)
            .then((hash) => {
                userSaveDetails.userPassword = hash;
                axios.post(url, userSaveDetails)
                    .then((res) => {
                        //console.log(res.data);
                        if (res.data) {
                            console.log("success sign up");
                            const user = { userId: res.data.userId, userOId: res.data._id.$oid };
                            const token = jwt.sign(user, keys.jwtKey, { algorithm: 'HS256', expiresIn: 60 * 60 });
                            const userClient = { token, userId: user.userId, userName: res.data.userName };
                            resolve(userClient);
                        } else {
                            reject("Invalid registration details!");
                        }
                    })
                    .catch((err) => {
                        reject("Internal error. Please try again!");
                    });
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userSignIn(userDetails) {
    return new Promise((resolve, reject) => {
        const userEmail = JSON.stringify(userDetails.userEmail);
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userEmail":' + userEmail + '}';
        axios.get(url)
            .then((res) => {
                if (res.data.length) {
                    const userFullDetails = res.data[0];
                    bcrypt.compare(userDetails.userPassword, userFullDetails.userPassword)
                        .then(function (res) {
                            if (res) {
                                console.log("success login");
                                const user = { userId: userFullDetails.userId, userOId: userFullDetails._id.$oid };
                                const token = jwt.sign(user, keys.jwtKey, { algorithm: 'HS256', expiresIn: 60 * 60 });
                                const userClient = { token, userId: user.userId, userName: userFullDetails.userName };
                                resolve(userClient);
                            } else {
                                reject("Incorrect password. Please try again!");
                            };
                        }).catch((err) => { reject("Internal error. Please try again!"); });
                } else {
                    reject("Please check email and try again!");
                };
            })
            .catch((err) => { reject("Internal error. Please try again!"); });
    });
}

function userDetails(userDetails) {
    return new Promise((resolve, reject) => {
        const userOId = userDetails.userOId;
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users/' + userOId + '?apiKey=' + keys.mlabAPIKey;
        axios.get(url)
            .then((res) => {
                //console.log(res.data);
                const userFullDetails = res.data;
                if (userFullDetails.length !== 0) {
                    console.log("success user details");
                    const user = { userName: userFullDetails.userName, userEmail: userFullDetails.userEmail };
                    resolve(user);
                } else {
                    reject("Invalid User. Please try again!");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userNewTrip(newTrip, user) {
    return new Promise((resolve, reject) => {
        const userOId = user.userOId;
        const userId = user.userId;
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userId":' + userId + '}&f={"userTrips":1}';
        axios.get(url)
            .then((res) => {
                //console.log(res.data[0]);
                //console.log(newTrip);
                const userOldTrips = res.data[0].userTrips;
                const newUserTrips = [...userOldTrips, newTrip];
                const urlNew = 'https://api.mlab.com/api/1/databases/tripo/collections/users/' + userOId + '?apiKey=' + keys.mlabAPIKey;
                axios.put(urlNew, { "$set": { "userTrips": newUserTrips } })
                    .then((res) => {
                        //console.log(res.data);
                        resolve(res.data);
                    })
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userNewResponse(newResponse, user) {
    return new Promise((resolve, reject) => {
        const userOId = user.userOId;
        const userId = user.userId;
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userId":' + userId + '}&f={"userResponses":1}';
        axios.get(url)
            .then((res) => {
                //console.log(res.data);
                const userOldResponses = res.data[0].userResponses;
                let newUserResponses = [];
                userOldResponses.forEach((o) => { if (o.tripId !== newResponse.tripId) { newUserResponses.push(o) } });
                newUserResponses.push(newResponse);
                const urlNew = 'https://api.mlab.com/api/1/databases/tripo/collections/users/' + userOId + '?apiKey=' + keys.mlabAPIKey;
                axios.put(urlNew, { "$set": { "userResponses": newUserResponses } })
                    .then((res) => {
                        //console.log(res.data);
                        resolve(res.data);
                    })
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userTrips(user) {
    return new Promise((resolve, reject) => {
        const userId = user.userId;
        console.log(userId);
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userId":' + userId + '}&f={"userTrips":1}';
        axios.get(url)
            .then((res) => {
                //console.log(res.data[0]);
                const userTrips = res.data[0].userTrips;
                if (userTrips.length !== 0) {
                    console.log("success user trips");
                    resolve(userTrips);
                } else {
                    reject("No planned Trips Yet! Try a new one.");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userResponses(user) {
    return new Promise((resolve, reject) => {
        const userId = user.userId;
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userId":' + userId + '}&f={"userResponses":1}';
        axios.get(url)
            .then((res) => {
                //console.log(res.data[0]);
                const userResponses = res.data[0].userResponses;
                if (userResponses.length !== 0) {
                    console.log("success user responses");
                    resolve(userResponses);
                } else {
                    reject("You have no Trips to respond or check!");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

module.exports = { userSignUp, userSignIn, userDetails, userNewTrip, userNewResponse, userTrips, userResponses };