const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

const clientTwilio = twilio(accountSid, authToken);

module.exports = { clientTwilio };
