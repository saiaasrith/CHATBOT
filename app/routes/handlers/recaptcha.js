const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/verify", async (req, res) => {
  const {g_recaptcha_token} = req.body;

  if (!g_recaptcha_token) {
    return res.status(400).json({status: "Fail", message: "Invalid recaptcha token sent"});
  }

  try {
    // recaptcha verify http request requires "application/x-www-form-urlencoded" headers
    const params = new URLSearchParams();
    params.append('secret', process.env.G_RECAPTCHA_SECRET_KEY);
    params.append('response', g_recaptcha_token);

    const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", params);
    if (response.data.success) {
      return res.status(200).json({status: "Success", message: "Recaptcha token verified"});
    } else {
      throw new Error(response.data["error-codes"]);
    }
  } catch (error) {
    return res.status(500).json({status: "Error", message: "Error occurred while verifying recaptcha token", data: error.message});
  }
});

module.exports = router;
