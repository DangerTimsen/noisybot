// lib/localio.js

'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

function getLocalIpAdresses() {
    var result = [];

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                result.push(ifname + ' : ' + iface.address)
            } else {
                // this interface has only one ipv4 adress
                result.push(ifname + ' : ' + iface.address)
            }
            ++alias;
        });
    });

    return result;
}

exports.getLocalIpAdresses = getLocalIpAdresses;