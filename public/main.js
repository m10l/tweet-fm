// Socket IO
var socket = io();

// Tone.js Instruments / Effects
var polySynth = new Tone.PolySynth(8, Tone.SimpleSynth, {
    oscillator: { type: 'sine', partials: [1,1,0,0,1] },
    envelope: { attack: '4n', decay: 0, sustain: 0, release: '4n' },
    volume: 0
});
var polySynth2 = new Tone.PolySynth(8, Tone.SimpleSynth, {
    oscillator: { type: 'sine', partials: [1,0,0,0,1] },
    envelope: { attack: '16n', decay: 0, sustain: 0, release: '16n' },
    volume: -40
});
var delay = new Tone.FeedbackDelay({ delayTime: '4t', feedback: 0.5, wet: 0.5 })
var reverb = new Tone.Convolver({ url:'ir.wav', wet: 0.75 });
var reverb2 = new Tone.Convolver({ url:'ir.wav', wet: 0.25 });
var limiter = new Tone.Limiter();
var panner = new Tone.Panner(0.5);

// Tone.js Connections
polySynth.chain(delay, reverb, limiter, panner, Tone.Master);
polySynth2.chain(reverb2, limiter, Tone.Master);

// Start after IR has loaded
Tone.Buffer.on('load', function() {

    socket.on('tweet', function(data) {
        var frequency = parseInt(data.frequency, 10);
        var pan = parseInt(data.pan, 10);
        panner.pan = pan;
        polySynth.triggerAttackRelease(frequency, '8n');
        document.body.style.background = 'hsl(' + data.color + ', 75%, 75%)';
    });

    socket.on('tweet-without-geo', function(data) {
        freq = Math.floor(Math.random() * (22000 - 20 + 1)) + 20;
        polySynth2.triggerAttackRelease(freq, '8n');
        document.getElementById('tweets').innerHTML = data.text;
        document.getElementById('flicker').classList.toggle('flicker');
    });

});

// Google Maps

function initMap() {

    var styles = [
        {
            'elementType': 'labels',
            'stylers': [{ 'visibility': 'off' }]
        },
        {
            'elementType': 'geometry.stroke',
            'stylers': [{ 'visibility': 'off' }]
        },
        {
            'elementType': 'geometry.fill',
            'stylers': [{ 'visibility': 'on' }, { 'saturation': -100 }]
        },
        {
            'featureType': 'landscape',
            'stylers': [{ 'visibility': 'off' }]
        },
        {
            'stylers': [{ 'gamma': '9.99' }]
        }
    ]

    var mapOptions = {
        center: {lat: 30, lng: 0},
        zoom: 2,
        scrollwheel: false,
        disableDefaultUI: true,
        styles: styles
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var hasMarker = false;
    var marker = new MarkerWithLabel({
        position: new google.maps.LatLng(0,0),
        icon: 'marker.svg',
        labelClass: 'label'
    });

    socket.on('tweet', function(data) {

        if (!hasMarker) {
            marker.setMap(map);
            hasMarker = true;
        }

        marker.setPosition( new google.maps.LatLng( data.lat, data.long ) );
        marker.set('labelContent', data.text);

    });

};

google.maps.event.addDomListener(window, 'load', initMap);
