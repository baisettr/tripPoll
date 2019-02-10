const auth = require('../services/user');
const checkUserAuth = require('../services/auth');

module.exports = app => {
    app.post('/userSignUp', (req, res) => {
        const userDetails = req.body.data;
        auth.userSignUp(userDetails)
            .then((token) => {
                res.status(200).json({ token });
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    });

    app.post('/userSignIn', (req, res) => {
        const userDetails = req.body.data;
        auth.userSignIn(userDetails)
            .then((token) => {
                res.status(200).json({ token });
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
};