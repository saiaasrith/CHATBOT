var express = require("express");
const requestIp = require('request-ip');
var router = express.Router();
var recaptchaHandler = require("./handlers/recaptcha.js");
var contactHandler = require("./handlers/contact.js");

router.use((req, res, next) => {
  let data = {
    requestPath: req.originalUrl,
    userIP: requestIp.getClientIp(req),
    date: new Date().toISOString()
  };
  console.log("API request : ", data);
  next();
});

router.use("/recaptcha", recaptchaHandler);

router.use("/contact", contactHandler);

module.exports = router;
