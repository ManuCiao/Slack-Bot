'use strict';

require('dotenv').config();

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');

const slackToken = process.env.SLACK_TOKEN;
const slackLogLevel = 'verbose';

const server = http.createServer(service);

const rtm = slackClient.init(slackToken, slackLogLevel);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', function(){
  console.log(`Slackbot is listening on ${server.address().port} in ${service.get('env')} mode.`);
});
