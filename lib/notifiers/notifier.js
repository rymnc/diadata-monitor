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
  success = async () => {
    for (let i = 0; i < this.config.length; i++) {
      try {
        if (
          this.config[i].successRate <
          this.config[i].lastSent + getUnixTime()
        ) {
          await this.transports[i].sendSuccess();
        }
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  };
}

module.exports = Notifier;
