/**
 * Dependencies
 * ============
 */

var express = require('express');
var Twit    = require('twit');
var secrets = require('./secrets');
var io      = require('socket.io');


/**
 * Config
 * ======
 */

// Express

var app = express();
app.use(express.static( __dirname + '/public' ));
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('App running on http://localhost:3000/');
});

app.get('/', function(req, res) {
    res.sendFile( __dirname + '/index.html' );
});

// Socket.IO

var io = io(server);

// Twitter

var T = new Twit({
    consumer_key        : secrets.twitter.consumer_key,
    consumer_secret     : secrets.twitter.consumer_secret,
    access_token        : secrets.twitter.access_token,
    access_token_secret : secrets.twitter.access_token_secret
});

var scale = function(input, fromMin, fromMax, toMin, toMax) {
    var fromRange = fromMax - fromMin;
    var toRange = toMax - toMin;
    output = (((input - fromMin) * toRange) / fromRange) + toMin;
    return output
};

var stream = T.stream('statuses/sample');
stream.on('tweet', function(tweet) {

    if (tweet.geo) {

        var long = tweet.geo.coordinates[1];
        var lat  = tweet.geo.coordinates[0];

        io.emit('tweet', {
            lat: lat,
            long: long,
            frequency : scale(long, 180, -180, 30, 100),
            pan       : scale(lat, -90, 90,  0, 1),
            color     : scale(long, 180, -180, 100, 1000),
            volume    : scale(lat, -90, 90,  0, 1),
            text      : tweet.text
        });

    }

    io.emit('tweet-without-geo', {
        text: tweet.text
    });

});
