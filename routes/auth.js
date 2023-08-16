const router = require("express").Router();
const connection = require("../mysql");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { clientTwilio } = require("../utils/twilio");

const otpStore = {};

// new user otp
router.post("/register", async (req, res) => {
  const { userName, email, password, phoneNumber } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[userName] = otp;
  const otpMessage = `Your OTP is: ${otp}. Please enter this code to verify your account.`;

  clientTwilio.messages
    .create({
      from: process.env.TWILIO_PHONO,
      to: phoneNumber,
      body: otpMessage,
    })
    .then((message) => console.log("opt send"));
  res.status(201).json({ userName, email, password, phoneNumber });
});

// verifying otp will create a new user
router.post("/verifyotp", (req, res) => {
  const { userName, email, password, phoneNumber, enteredOtp } = req.body;

  const storedOtp = otpStore[userName];
  const passwordHash = bcrypt.hashSync(password, 10);

  const insertQuery =
    "INSERT INTO users (username, email,phone_no,password) VALUES (?,?,?,?)";

  if (storedOtp && enteredOtp === storedOtp.toString()) {
    delete otpStore[userName];

    connection.query(
      insertQuery,
      [userName, email, phoneNumber, passwordHash],
      (error, results) => {
        if (error) {
          res.status(500).json({ error: "Error user data" });
        } else {
          const user = results;
          const accessToken = JWT.sign(
            {
              id: user.insertId,
              userName,
            },
            process.env.PASSTOKEN,
            { expiresIn: "5h" }
          );
          res.status(200).json({ userName, accessToken });
        }
      }
    );
  } else {
    res.status(401).json({ error: "Invalid OTP" });
  }
});

// login
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  const checkQuery =
    "SELECT id, password, username FROM users WHERE username = ?";

  connection.query(checkQuery, [userName], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error user data" });
    } else {
      const user = results[0];
      const hashedPassword = user.password;
      bcrypt.compare(password, hashedPassword, (compareError, isMatch) => {
        if (compareError) {
          console.error("Error comparing passwords:", compareError);
          res.status(500).json({ error: "Error comparing passwords" });
        } else if (isMatch) {
          const accessToken = JWT.sign(
            {
              id: user.id,
              userName: user.username,
            },
            process.env.PASSTOKEN,
            { expiresIn: "5h" }
          );
          res.status(200).json({ userName: user.username, accessToken });
        } else {
          res.status(401).json({ error: "Wrong User name or Password" });
        }
      });
    }
  });
});
//
module.exports = router;
