const router = require("express").Router();
const connection = require("../mysql");
const jwt = require("jsonwebtoken");

const jwtSecret = "password";

const otpStore = {};

router.post("/send-otp", (req, res) => {
  const { phoneNumber } = req.body;

  const query = "SELECT * FROM users WHERE phone = ?";
  connection.query(query, [phoneNumber], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Phone number not registered" });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[phoneNumber] = otp;
    console.log("Otp will be send to phone", otp);
  });
});

router.post("/verify-otp", (req, res) => {
  const { phoneNumber, enteredOtp } = req.body;

  const storedOtp = otpStore[phoneNumber];

  if (storedOtp && enteredOtp === storedOtp.toString()) {
    delete otpStore[phoneNumber];
    const newToken = jwt.sign({ phoneNumber, name }, jwtSecret, {
      expiresIn: "1h",
    });
    res.json({ message: "OTP verified successfully", token: newToken });
  } else {
    res.status(401).json({ error: "Invalid OTP" });
  }
});

//
module.exports = router;
