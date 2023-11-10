const config = require("config");
const tracker = require("../log/logger");
module.exports = function () {
  const privateKey = config.get("pass_key");
  const mail_account = config.get("mail_account");
  const mail_pass = config.get("mail_pass");
  const dev_pass = config.get("dev_pass");
  const dev_email = config.get("dev_email");
  const dev_phone = config.get("dev_phone");

  const notSet = privateKey && mail_account && mail_pass && dev_email && dev_pass && dev_phone
  if (!notSet) {

    tracker.error("Required App config  variables not set ....");
    throw new Error(
      "Pass key, Mail Account, and Mail password are required before starting the app ..."
    );
  }
};
