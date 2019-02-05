const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const keys = require('./config/keys');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(5000, function () {
    console.log("Listening here");
})

// mlab save a new user
app.post('/newUser', function (req, res) {
    console.log(req.body.userData);
    const userDetails = req.body.userData;
    newUser(userDetails, (data) => {
        res.send(data);
    })
})

function newUser(userDetails, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey;
    axios.post(url, userDetails
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// mlab get user trips
app.get('/userTrips', function (req, res) {
    console.log(req.query.userId);
    const userId = req.body.userId;
    userTrips(userId, (data) => {
        res.send(data);
    })
})

function userTrips(userId, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userId":' + userId + '}';
    axios.get(url
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// mlab save a new trip
app.post('/newTrip', function (req, res) {
    //console.log(req.body.data);
    const tripDetails = req.body.data;
    saveNewTrip(tripDetails, (data) => {
        res.send(data);
    })
})

function saveNewTrip(tripDetails, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=' + keys.mlabAPIKey;
    axios.post(url, tripDetails
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// mlab fetch trip
app.get('/trip', function (req, res) {
    console.log(req.query.tripId);
    const tripId = req.query.tripId;
    trip(tripId, (data) => {
        res.send(data);
    })
})

function trip(tripId, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=' + keys.mlabAPIKey + '&q={"tripId":' + tripId + '}';
    axios.get(url
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// mlab save trip options
app.post('/tripOptions', function (req, res) {
    console.log(req.body.data);
    console.log(req.body.tripId);
    const tripId = req.body.tripId;
    const tripOptions = req.body.data;
    tripOptionsSave(tripId, tripOptions, (data) => {
        res.send(data);
    })
})

function tripOptionsSave(tripId, tripOptions, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips/' + tripId + '?apiKey=' + keys.mlabAPIKey;
    axios.put(url, { "$set": { "tripSelectedOptions": tripOptions } }
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// mlab finalize trip options
app.post('/tripFinal', function (req, res) {
    console.log(req.body.options);
    console.log(req.body.tripId);
    const tripId = req.body.tripId;
    const options = req.body.options;
    tripFinal(tripId, options, (data) => {
        res.send(data);
    })
})

function tripFinal(tripId, options, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips/' + tripId + '?apiKey=' + keys.mlabAPIKey;
    axios.put(url, { "$set": { "finalTrip": options } }
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// google places
app.get('/places', function (req, res) {
    console.log(req.query.dest);
    const dest = req.query.dest.split(', ').join('+');
    console.log(dest);
    places(dest, (data) => {
        res.send(data);
    })
})

function places(dest, callback) {
    const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + dest + '+tourist+attractions&language=en&key=' + keys.googleAPIKey;
    axios.get(url,
        {}).then((res) => {
            //console.log(res.data);
            return callback(res.data);
        }).catch((error) => {
            console.log(error);
        });
}

// google place suggestions
app.get('/placeSuggestions', function (req, res) {
    console.log(req.query.dest);
    const dest = req.query.dest;
    console.log(dest);
    placeSuggestions(dest, (data) => {
        res.send(data);
    })
})

function placeSuggestions(dest, callback) {
    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + dest + '&types=geocode&key=' + keys.googleAPIKey;
    axios.get(url,
        {}).then((res) => {
            const pr = res.data.predictions;
            const des = pr.map((e) => e.description);
            return callback(des);
        }).catch((error) => {
            console.log(error);
        });
}


// airbnb listings
app.get('/listings', function (req, res) {
    console.log(req.query.dest);
    const dest = req.query.dest;
    console.log(dest);
    getL(dest)
        .then((data) => {
            console.log("res");
            console.log(JSON.stringify(data.search_results));
            res.send(data);
        })
        .catch((e) => { console.log("error"); console.log(e) })
})


var request = require('request');
function getL(place) {
    const headers = {
        'cache-control': 'no-cache',
        'user-agent': 'Airbnb/17.50 iPad/11.2.1 Type/Tablet',
        'content-type': 'application/json',
        'accept': 'application/json',
        'accept-language': 'en-us',
        'x-airbnb-api-key': keys.airbnbAPIKey,
        'x-airbnb-locale': 'en',
        'x-airbnb-currency': 'USD',
    }

    var options = {
        method: 'GET',
        url: 'https://api.airbnb.com/v2/search_results/',
        headers: headers,
        qs: {
            '_limit': 12,
            '_offset': 0,
            'locale': 'en-US',
            'location': place,
        }
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, res) {
            if (error) {
                reject(error);
            } else {
                const x = JSON.parse(res.body);
                resolve(x);
            }
        });
    });
}


function airbnbPlaces(location, callback) {
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
            '_limit': 10,
            '_offset': 0,
            'locale': 'en-US',
            'location': 'Corvallis, Oregon',
        }
    };

    axios(options).then((res) => {
        console.log(res);
        return callback(res.data);

    }).catch((error) => {
        console.log(error);
    });
}

if (process.env.NOD_ENV === 'production') {
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

