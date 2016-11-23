'use strict';
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm = null;
let nlp = null;

function handlerOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

function handlerOnMessage(message) {
  
    nlp.ask(message.text, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }

        if (!res.intent) {
            return rtm.sendMessage("Sorry, I don't know what you are talking about.", message.channel);
        } else if (res.intent[0].value == 'time' && res.location) {
            return rtm.sendMessage(`Sorry, I don't yet know the time in ${res.location[0].value}`, message.channel);
        } else {
            console.log(res);
            return rtm.sendMessage("Sorry, I don't know what you are talking about.", message.channel);
        }

        rtm.sendMessage('Sorry, I did not understand.', message.channel, function messageSent() {
            // optionally, you can supply a callback to execute once the message has been sent
        });
    });
}


module.exports.init = function slackClient(token, logLevel, nlpClient) {
    rtm = new RtmClient(token, {
        logLevel: logLevel
    });
    nlp = nlpClient;
    addAuthenticatedHandler(rtm, handlerOnAuthenticated);
    rtm.on(RTM_EVENTS.MESSAGE, handlerOnMessage);
    return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
