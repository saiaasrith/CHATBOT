const nodemailer = require("nodemailer");

class EmailHelper {
  static transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.G_APP_PASSWORD
    }
  });

  static sendEmail(subject, emailBody) {
    const emailData = {
      from: process.env.NODE_MAILER_EMAIL, // Sender address
      to: "nitish0399@hotmail.com", // List of recipients
      subject: subject, // Subject line
      html: emailBody
    };

    this.transport.sendMail(emailData, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("User connected to chatbot email sent to nitish0399@hotmail.com");
      }
    });
  }
}

module.exports = EmailHelper;
