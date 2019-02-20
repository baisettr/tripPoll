const auth = require('../services/user');
const checkUserAuth = require('../services/auth');

module.exports = app => {
    app.post('/userSignUp', (req, res) => {
        const userDetails = req.body.data;
        auth.userSignUp(userDetails)
            .then((userClient) => {
                res.status(200).json({ userClient });
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.post('/userSignIn', (req, res) => {
        const userDetails = req.body.data;
        auth.userSignIn(userDetails)
            .then((userClient) => {
                res.status(200).json({ userClient });
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.get('/userDetails', checkUserAuth, (req, res) => {
        const user = req.user;
        auth.userDetails(user)
            .then((data) => {
                res.status(200).json({ data });
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.post('/userNewTrip', checkUserAuth, (req, res) => {
        const newTrip = req.body.data;
        const user = req.user;
        auth.userNewTrip(newTrip, user)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.post('/userNewResponse', checkUserAuth, (req, res) => {
        const newResponse = req.body.data;
        const user = req.user;
        auth.userNewResponse(newResponse, user)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.get('/userTrips', checkUserAuth, (req, res) => {
        const user = req.user;
        auth.userTrips(user)
            .then((data) => {
                res.status(200).json({ data });
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.get('/userResponses', checkUserAuth, (req, res) => {
        const user = req.user;
        auth.userResponses(user)
            .then((data) => {
                res.status(200).json({ data });
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });
};