const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const {body, validationResult} = require('express-validator');

let transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.G_APP_PASSWORD
  }
});

router.post("/", [
  body('fullName').not().isEmpty().trim().escape(), body('email').isEmail().normalizeEmail(), body('message').not().isEmpty().trim().escape()
], async (req, res) => {
  const {fullName, email, message} = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({status: "Error", message: "Invalid input values", errors: errors.array()});
  }

  const emailData = {
    from: process.env.NODE_MAILER_EMAIL, // Sender address
    to: process.env.NODE_MAILER_EMAIL, // List of recipients
    subject: `Message from ${fullName} | Stranger Talks`, // Subject line
    html: `
      <b>${fullName}</b> has contacted Stranger Talks.
      <br><br>

      Full Name : <b> ${fullName} </b><br>
      Email Id : <b> ${email} </b><br>
      Message : <b> ${message} </b>
    `
  };
  transport.sendMail(emailData, function(error, info) {
    if (error) {
      console.log(error);
      return res.status(500).json({status: "Error", message: "Error occurred while sending message", data: error.message});
    } else {
      console.log(info);
      return res.status(200).json({status: "Success", message: "Your message is sent!"});
    }
  });

});

module.exports = router;
