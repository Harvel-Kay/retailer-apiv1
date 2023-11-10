const config = require("config");
const tracker = require("../log/logger");
module.exports = function () {
  const privateKey = config.get("pass_key");
  const father = config.get("father");
  
  const dontStart = !father || !privateKey
  if (dontStart) {
    tracker.error("Required App config  variables not set ....");
    throw new Error(
      "Pass key, Mail Account, and Mail password are required before starting the app ..."
    );
  }
};
