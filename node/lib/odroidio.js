// lib/odroidio.js

'use strict';
var gpio = require('odroid-gpio');

function enableLights(seconds) {
    console.log('Try enabling lights for ' + seconds + ' seconds');

    gpio.open(16, "output", function (err) {		// Open pin 16 for output 
        gpio.write(16, 1, function () {			// Set pin 16 high (1) 
            gpio.close(16);						// Close pin 16 
        });
    });

    setTimeout(disableLights, seconds * 1000)

    return gpio.read(16, function (err, value) {
        if (err) throw err;
        return value;	// The current state of the pin 
    });
}

function disableLights() {
    gpio.open(16, "output", function (err) {		// Open pin 16 for output 
        gpio.write(16, 0, function () {			// Set pin 16 high (0) 
            gpio.close(16);						// Close pin 16 
        });
    });
    console.log('Disabling lights: pinValue: ' + lightPin.value);
}

exports.enableLights = enableLights;