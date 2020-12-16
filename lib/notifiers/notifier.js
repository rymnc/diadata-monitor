const allNotifiers = require("./modes/allNotifierIngress");
const { getUnixTime } = require("../helpers/utils");
/**
 * Main Notifier Class
 */
class Notifier {
  constructor(notifierConfig) {
    this.config = notifierConfig;
    this.listOfNotifiers = this.config.map((notifier) => notifier.name);
    this.transports = this.config.map(
      (notifier) => new allNotifiers[notifier.class](notifier)
    );
  }

  /**
   * Gets the transport names
   */
  getListOfNotifiers = () => {
    return this.listOfNotifiers;
  };

  /**
   * Send Error via all transports
   * @param {object} error
   * @returns {boolean}
   */
  error = async (err) => {
    for (let i = 0; i < this.config.length; i++) {
      try {
        await this.transports[i].sendError(err);
        console.log("Sent Error via", this.listOfNotifiers[i]);
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  };

  /**
   * Send Success message via all transports
   * @returns {boolean}
   */
  success = async (payload) => {
    for (let i = 0; i < this.config.length; i++) {
      try {
        if (
          this.config[i].lastSent === undefined ||
          getUnixTime - this.config[i].successRate > this.config[i].lastSent
        ) {
          await this.transports[i].sendSuccess(payload);
          console.log("Sent Success via", this.listOfNotifiers[i]);
        } else {
          console.log("Currently in Liveness Mode, Not sending Healthy Email");
        }
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  };
}

module.exports = Notifier;
