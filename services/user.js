const axios = require('axios');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

function userSignUp(userDetails) {
    return new Promise((resolve, reject) => {

        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey;
        axios.post(url, userDetails)
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    const user = { userId: res.data.userId, userOId: res.data._id.$oid }
                    getJwtToken(user).then((e) => resolve(e));
                } else {
                    reject("Invalid registration details!");
                }
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userSignIn(userDetails) {
    return new Promise((resolve, reject) => {
        const userEmail = JSON.stringify(userDetails.userEmail);
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userEmail":' + userEmail + '}';;
        axios.get(url)
            .then((res) => {
                console.log(res.data);
                const userFullDetails = res.data[0];
                if (userFullDetails.length !== 0) {
                    if (userFullDetails.password === userDetails.password) {
                        console.log("success");
                        const user = { userId: userFullDetails.userId, userOId: userFullDetails._id.$oid }
                        getJwtToken(user).then((e) => resolve(e));
                    } else {
                        reject("Incorrect password. Please try again!");
                    };
                } else {
                    reject("Please check email and try again!");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function getJwtToken(user) {
    return new Promise((resolve, reject) => {
        jwt.sign(user, keys.jwtKey, { algorithm: 'HS256', expiresIn: 60 * 60 }, function (err, token) {
            resolve(token);
        });
    });
}

function isUserValid(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, keys.jwtKey, { algorithm: 'HS256' }, function (err, user) {
            resolve(user);
        });
    });
}

module.exports = { userSignUp, userSignIn, isUserValid };


/* let userSIgnUpDetails = { userId: 2345, password: 'gbhnjnjjn7', userName: 'hello', userEmail: 'cfvghb@fgh.com' };
let userSIgnInDetails = { userEmail: "cfvghb@fgh.com", password: 'gbhnjnjjn7' };
//userSignUp(userSIgnUpDetails).then((e) => console.log(e));
userSignIn(userSIgnInDetails).then((e) => console.log(e));
//let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJPSWQiOiI1YzVhNDAyZTVkMGU2NTE0ZDIxYjYxMGEiLCJpYXQiOjE1NDk0MTg1NDIsImV4cCI6MTU0OTQxODYwMn0.KS-wVNbft5u4Dm0jhBKP5KnYBQfm2SUjQ70R882OOfo'
//verifyJwtToken(token).then((e) => console.log(e)); */