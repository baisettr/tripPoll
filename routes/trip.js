const trip = require('../services/trip');
const checkUserAuth = require('../services/auth');

module.exports = app => {
    app.post('/tripNew', checkUserAuth, (req, res) => {
        const tripDetails = req.body.data;
        trip.saveNewTrip(tripDetails)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.get('/trip', checkUserAuth, (req, res) => {
        const tripId = req.query.tripId;
        trip.getTrip(tripId)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.get('/myTrips', checkUserAuth, (req, res) => {
        const user = req.user;
        trip.getMyTrips(user)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.get('/friendTrips', checkUserAuth, (req, res) => {
        const user = req.user;
        trip.getFriendTrips(user)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.post('/tripOptions', checkUserAuth, (req, res) => {
        const tripId = req.body.tripId;
        const tripOptions = req.body.data;
        trip.saveTripOptions(tripId, tripOptions)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.post('/tripFinal', checkUserAuth, (req, res) => {
        const tripId = req.body.tripId;
        const tripFinalOptions = req.body.data;
        trip.saveTripOptions(tripId, tripFinalOptions)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });
};