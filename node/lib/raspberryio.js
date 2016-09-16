// lib/raspberryio.js

'use strict';

var gpio = require('gpio');

var lightPin = gpio.export(7,{
   // When you export a pin, the default direction is out. This allows you to set 
   // the pin value to either LOW or HIGH (3.3V) from your program. 
   direction: 'out',
 
   // set the time interval (ms) between each read when watching for value changes 
   // note: this is default to 100, setting value too low will cause high CPU usage 
   interval: 200,
 
   // Due to the asynchronous nature of exporting a header, you may not be able to 
   // read or write to the header right away. Place your logic in this ready 
   // function to guarantee everything will get fired properly 
   ready: function() {
   }
})

function enableLights(seconds) {
    console.log('Try enabling lights for ' + seconds + ' seconds' );

    setTimeout(disableLights, seconds * 1000)
    
    lightPin.set(function(){
       console.log('Enabled lights: pinValue: ' + lightPin.value);
    });
    return lightPin.value;    
}

function disableLights(){
    lightPin.reset();
    console.log('Disabling lights: pinValue: ' + lightPin.value);
}

exports.enableLights = enableLights;