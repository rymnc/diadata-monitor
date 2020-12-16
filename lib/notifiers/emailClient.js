const nodemailer = require("nodemailer");

/**
 * Email Client
 */
class EmailClient {
  /**
   * Gets the email transport
   * @param {object} emailOptions
   */
  constructor(emailOptions) {
    this.transport = nodemailer.createTransport({
      service: emailOptions.host,
      auth: {
        user: emailOptions.emailId,
        pass: process.env.emailPassword,
      },
    });
    this.defaultOpts = {
      from: emailOptions.emailId,
      subject: "DIA Data Contract Notifier: ",
    };
    this.emailTo = emailOptions.to;
  }

  sendEmail = async (options) => {
    const ephOptions = {};
    Object.assign(ephOptions, this.defaultOpts, options);
    for (let i = 0; i < this.emailTo.length; i++) {
      ephOptions.to = this.emailTo[i];
      await this.transport.sendMail(ephOptions);
    }
    return true;
  };
  /**
   * Sends the error email to required recipients
   * @param {object} err
   * @returns {boolean}
   */
  sendError = async (err) => {
    const htmlbody = {
      html: `<h1> An Error has been detected in one of the contracts linked to this monitor </h1><br> <p>Contract Name: ${err.contract.name}<br> Contract Address: ${err.contract.address}<br> Error Type: ${err.type}<br> Error Log: ${err.body}`,
    };
    const result = await this.sendEmail(htmlbody);
    return result;
  };

  /**
   * Sends the success email to required recipients
   * @returns {boolean}
   */
  sendSuccess = async () => {
    const htmlbody = {
      html: `<h1> The System is running as Intended! </h1>`,
    };
    const result = await this.sendEmail(htmlbody);
    return result;
  };
}

module.exports = EmailClient;
