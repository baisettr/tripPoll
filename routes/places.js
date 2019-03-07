const place = require('../services/places');
//const checkUserAuth = require('../services/auth');

module.exports = app => {
    app.get('/placeSuggestions', (req, res) => {
        const dest = req.query.dest;
        place.getPlaceSuggestions(dest)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.get('/places', (req, res) => {
        const dest = req.query.dest.split(', ').join('+');
        place.getPlaces(dest)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.get('/restaurants', (req, res) => {
        const dest = req.query.dest.split(', ').join('+');
        place.getRestaurants(dest)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.get('/listings', (req, res) => {
        const dest = req.query.dest;
        place.getListings(dest)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });
};