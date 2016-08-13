

// lib/noisybot.js

'use strict';

var util = require('util');
var Bot = require('slackbots');

var NoisyBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'noisybot';

    this.user = null;
};

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
};

NoisyBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

NoisyBot.prototype._welcomeMessage = function () {
    this.postMessageToUser('tim', 'Hi guys, how is the hammer hanging?' +
        '\n I can shut up people. Just say `RUHE` or `' + this.name + '` to invoke me!',
        {as_user: true});
};

NoisyBot.prototype._onMessage = function (message) {

    console.log('got message');
    console.log(message);
    
    if (this._isChatMessage(message) &&
        //this._isChannelConversation(message) &&
        //!this._isFromNoisyBot(message) &&
        this._isMentioningRuhe(message)
    ) {
        //turn on lights
        console.log('replying');
        this._reply(message);
    }
};

NoisyBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

NoisyBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

NoisyBot.prototype._isFromNoisyBot = function (message) {
    return message.user === this.user.id;
};

NoisyBot.prototype._isMentioningRuhe = function (message) {
    return message.text.toLowerCase().indexOf('ruhe') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

NoisyBot.prototype._reply = function (originalMessage) {
    //turn on transistors
this.postMessageToUser('tim', 'lääuft',        {as_user: true});
    //reply 
    var channel = self._getChannelById(originalMessage.channel);
        self.postMessageToChannel(channel.name, 'I am punching the transistors', {as_user: true});
};

NoisyBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};