

// lib/noisybot.js

'use strict';

var util = require('util');
var Bot = require('slackbots');
var Permission = require('./userpermission');
var LocalIo = require('./localio');
var retrieveUserWhitelist = retrieveUserWhiteList;

var hardware = {};

//this.userwhitelist set by retrieveUserWhitelist()

var NoisyBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'noisybot';
    this.user = null;

    setHardware(settings.hardwaretype);
};

function setHardware(hardwaretype) {
    switch (hardwaretype.toLowerCase()) {
        case "rpi":
            hardware = require('./raspberryio.js');
            break;
        case "odroid":
            hardware = require('./odroidio.js');
            break;
        default:
            hardware = require('./raspberryio.js');
    }
}

// inherits methods and properties from the Bot constructor
util.inherits(NoisyBot, Bot);

module.exports = NoisyBot;

NoisyBot.prototype.run = function () {
    NoisyBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

NoisyBot.prototype._onStart = function () {
    this._loadBotUser();
    this._welcomeMessage();
    this._setUserWhitelist();
};


NoisyBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

NoisyBot.prototype._setUserWhitelist = function () {
    if (!this.userwhitelist) {
        retrieveUserWhitelist(this);
    }
}

NoisyBot.prototype._welcomeMessage = function () {
    /*this.postMessageToUser('tim', 'Hi guys,' +
        '\n I can try to shut up people. Just send a direct message with the word `ruhe` in it to invoke me!',
        { as_user: true });*/
};

NoisyBot.prototype._onMessage = function (message) {
    console.log('got message');
    console.log(message);

    if (!this._isChatMessage(message)) {
        return;
    }

    if(this._isFromNoisyBot(message)){
        return;
    }

    if (this._isMentioningLightKeywords(message)) {
        this._replyToLight(message);
    }

    if (this._isMentioningLocalIpKeywords(message)) {
        this._replyToLocalIp(message);
    }


};

NoisyBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

NoisyBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

NoisyBot.prototype._isDirectConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'D';
};

NoisyBot.prototype._isFromNoisyBot = function (message) {
    return message.user === this.user.id;
};

NoisyBot.prototype._isFromAllowedUser = function (message) {
    var user = this._getUserById(message.user);

    if (this.userwhitelist.some(userwhite => userwhite.name === user.name)) {
        return true;
    } else {
        return false;
    }
};

NoisyBot.prototype._isMentioningLightKeywords = function (message) {
    return message.text.toLowerCase().indexOf('ruhe') > -1 ||
        message.text.toLowerCase().indexOf('silence') > -1;
};

NoisyBot.prototype._isMentioningLocalIpKeywords = function (message) {
    return message.text.toLowerCase().indexOf('addresses') > -1 ||
        message.text.toLowerCase().indexOf('ip') > -1;
};

NoisyBot.prototype._replyToLight = function (originalMessage) {

    var replyMessage = '';

    var user = this._getUserById(originalMessage.user);

    if (!this._isFromAllowedUser(originalMessage)) {
        replyMessage = 'Hello ' + user.name + '. You dont seem to have permission to invoke strobo lightning storm. Please contact my creator if you like to use me.';
    } else {
        replyMessage = 'I am punching the transistor, master ' + user.name + '. I will keep the light on for 10 seconds for you.';
        //turn on transistors
        turnOnLights(10);
    }

    if (this._isDirectConversation(originalMessage)) {
        var user = this._getUserById(originalMessage.user);
        this.postMessageToUser(user.name, replyMessage, { as_user: true });
    }
    //reply 
    if (this._isChannelConversation(originalMessage)) {
        var channel = this._getChannelById(originalMessage.channel);
        this.postMessageToChannel(channel.name, replyMessage, { as_user: true });
    }
};

NoisyBot.prototype._replyToLocalIp = function (originalMessage) {

    var replyMessage = '';

    var user = this._getUserById(originalMessage.user);

    if (!this._isFromAllowedUser(originalMessage)) {
        replyMessage = 'Hello ' + user.name + '. You dont seem to have permission to gather my local network addresses. Please contact my creator if you like to use me.';
    } else {
        replyMessage = 'I will try to access my operating system to obtain my addresses, master ' + user.name + '. Everything you want, master.\n';
        var localIpResult = LocalIo.getLocalIpAdresses();
        if (localIpResult) {
            replyMessage += 'I got it, master. I got it for you. Here it is, master.\n';
            localIpResult.forEach(function (element) {
                replyMessage += element + '\n';
            }, this);
        } else {
            replyMessage += 'Sorry master. OS no speak to me. nooo. so sorry master.'
        }
    }

    if (this._isDirectConversation(originalMessage)) {
        var user = this._getUserById(originalMessage.user);
        this.postMessageToUser(user.name, replyMessage, { as_user: true });
    }
    //reply 
    if (this._isChannelConversation(originalMessage)) {
        var channel = this._getChannelById(originalMessage.channel);
        this.postMessageToChannel(channel.name, replyMessage, { as_user: true });
    }
};

NoisyBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

NoisyBot.prototype._getUserById = function (userId) {
    return this.users.filter(function (item) {
        return item.id === userId;
    })[0];
};

function retrieveUserWhiteList(noisybot) {
    var getPromise = Permission.getUserWhitelistRequest();

    getPromise.on('success', function (response) {
        if (response.error) { console.log(error); }
        else {
            var content = response.data.Body.toString();
            var rawarray = JSON.parse(content);
            var result = [];
            rawarray.forEach(function (current, index, array) {
                var user = noisybot.users.filter(function (item) {
                    return item.name === current
                })[0];

                if (user)
                    result.push(user);
            })

            noisybot.userwhitelist = result;
        }
    });

    getPromise.send();
};

function turnOnLights(seconds) {
    return hardware.enableLights(seconds);
}