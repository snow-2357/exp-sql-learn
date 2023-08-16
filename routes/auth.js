const router = require("express").Router();
const connection = require("../mysql");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { clientTwilio } = require("../utils/twilio");

// new user otp
router.post("/register", async (req, res) => {
  const { userName, email, password, phoneNumber } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpMessage = `Your OTP is: ${otp}. Please enter this code to verify your account.`;

  const insertQuery =
    "INSERT INTO temporary_otp (username, phone_number,otp) VALUES (?,?,?)";

  clientTwilio.messages
    .create({
      from: process.env.TWILIO_PHONO,
      // to: phoneNumber,
      to: "+917002672204",
      body: otpMessage,
    })
    .then((message) => {
      connection.query(
        insertQuery,
        [userName, phoneNumber, otp],
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Error user data" });
          } else {
            res.status(201).json({ userName, email, password, phoneNumber });
          }
        }
      );
    });
});

// verifying otp will create a new user
router.post("/verifyotp", (req, res) => {
  const { userName, email, password, phoneNumber, enteredOtp } = req.body;

  const passwordHash = bcrypt.hashSync(password, 10);

  const otpQuery =
    "SELECT otp FROM temporary_otp WHERE userName=? AND expires_at > NOW() ORDER BY created_at desc limit 1";

  const insertQuery =
    "INSERT INTO users (username, email,phone_no,password) VALUES (?,?,?,?)";

  connection.query(otpQuery, [userName], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error user data" });
    } else {
      if (results[0].otp && enteredOtp === results[0].otp.toString()) {
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
    }
  });
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
