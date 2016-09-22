// bin/bot.js

'use strict';

require('dotenv').config();
var NoisyBot = require('../lib/noisybot');

var slacktoken =  process.env.BOT_API_KEY;
var name = 'noisybot'//process.env.BOT_NAME;

var noisybot = new NoisyBot({
    token: slacktoken,
    name: name
});

noisybot.run();