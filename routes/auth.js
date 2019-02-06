const axios = require('axios');
const jwt = require('jsonwebtoken');
const auth = require('../services/user');

module.exports = app => {
    app.post('/userSignUp', (req, res) => {
        const userDetails = req.body.userDetails;
        auth.userSignUp(userDetails)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                console.log(err)
            });
    });

    app.post('/userSignIn', (req, res) => {
        const userDetails = req.body.userDetails;
        auth.userSignIn(userDetails)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                console.log(err)
            });
    });

    app.get('/userDetails', auth.isUserValid, (req, res) => {
        const userDetails = req.query.userDetails;
        auth.getUserDetails(userDetails)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                console.log(err)
            });
    });
};