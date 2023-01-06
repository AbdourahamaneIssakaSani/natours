const nodemailer = require("nodemailer");

/**
 * Represents email services (nodemailer or sendgrid)
 */
class EmailServices {
  /**
   * Sends email to a user, using nodemailer
   * @param {*} options
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
