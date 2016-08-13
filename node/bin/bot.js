// bin/bot.js

'use strict';

require('dotenv').config();
var NoisyBot = require('../lib/noisybot');

var token =  process.env.BOT_API_KEY;
var name = 'noisybot'//process.env.BOT_NAME;

var noisybot = new NoisyBot({
    token: token,
    name: name
});

noisybot.run();