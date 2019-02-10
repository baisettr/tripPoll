const axios = require('axios');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

function userSignUp(userDetails) {
    return new Promise((resolve, reject) => {

        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey;
        axios.post(url, userDetails)
            .then((res) => {
                //console.log(res.data);
                if (res.data) {
                    console.log("success sign up");
                    const user = { userId: res.data.userId, userOId: res.data._id.$oid }
                    const token = jwt.sign(user, keys.jwtKey, { algorithm: 'HS256', expiresIn: 60 * 60 });
                    resolve(token);
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
                if (res.data.length) {
                    const userFullDetails = res.data[0];
                    if (userFullDetails.userPassword === userDetails.userPassword) {
                        console.log("success");
                        const user = { userId: userFullDetails.userId, userOId: userFullDetails._id.$oid }
                        const token = jwt.sign(user, keys.jwtKey, { algorithm: 'HS256', expiresIn: 60 * 60 });
                        resolve(token);
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
                    const user = { userName: userFullDetails.userName, userEmail: userFullDetails.userEmail }
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

module.exports = { userSignUp, userSignIn, userDetails };





/* let userSIgnUpDetails = { userId: 2345, password: 'gbhnjnjjn7', userName: 'hello', userEmail: 'cfvghb@fgh.com' };
let userSIgnInDetails = { userEmail: "cfvghb@fgh.com", password: 'gbhnjnjjn7' };
userSignUp(userSIgnUpDetails).then((e) => console.log(e));
userSignIn(userSIgnInDetails).then((e) => console.log(e));

function getJwtToken(user) {
    return new Promise((resolve, reject) => {
        jwt.sign(user, keys.jwtKey, { algorithm: 'HS256', expiresIn: 60 * 60 }, function (err, token) {
            resolve(token);
        });
    });
};

function verifyJwtToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, keys.jwtKey, { algorithm: 'HS256' }, function (err, user) {
            resolve(user);
        });
    });
}; */