'use strict';
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

function handlerOnAuthenticated(rtmStartData){
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}
function addAuthenticatedHandler(rtm, handler) {
  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

module.exports.init = function slackClient(token, logLevel){
  const rtm = new RtmClient(token, {logLevel: logLevel});
  addAuthenticatedHandler(rtm, handlerOnAuthenticated);
  return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
// rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
//   console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
// });
//
// rtm.start();
