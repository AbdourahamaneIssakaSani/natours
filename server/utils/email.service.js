const nodemailer = require("nodemailer");

/**

EmailServices class is responsible for sending emails to users.
It currently supports sending emails through NodeMailer.
*/

class EmailServices {
  /**
   * Sends an email to the provided recipient using NodeMailer
   * @param {Object} options - options for the email
   * @param {String} options.email - recipient email address
   * @param {String} options.subject - subject of the email
   * @param {String} options.message - message body of the email
   */
  static async sendWithNodeMailer(options) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "Abissa <hello@abissa.tech>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
  }
  //   static sendWithSendGrid() {}
}

module.exports = EmailServices;
