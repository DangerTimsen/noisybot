// lib/userpermission.js

'use strict';

var AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws.config');

function getUserWhitelist() {
    var s3 = new AWS.S3();
    var params = { Bucket: 'noisybotdata', Key: 'userwhitelist.dat' };

  return s3.getObject(params);
}

exports.getUserWhitelist = getUserWhitelist;