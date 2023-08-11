const router = require("express").Router();
const connection = require("../mysql");
const jwt = require("jsonwebtoken");

const jwtSecret = "password";

const otpStore = {};

router.post("/send-otp", (req, res) => {
  const { phoneNumber } = req.body;

  const query = "SELECT id, name FROM users WHERE phone = ?";
  connection.query(query, [phoneNumber], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Phone number not registered" });
    }

    const user = results[0];
    const userId = user.id;
    const userName = user.name;

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[phoneNumber] = otp;
    console.log("Otp will be send to phone", otp);

    res.json({ message: "OTP sent successfully", token, userId, userName });
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

// new user register
router.post("/register", async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  const passwordHash = bcrypt.hashSync(password, 10);

  const insertQuery =
    "INSERT INTO users (name, email,phone_no,password) VALUES (?, ?,?,?)";

  connection.query(
    insertQuery,
    [name, email, phoneNumber, passwordHash],
    (error, results) => {
      if (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ error: "Error inserting user" });
      } else {
        // console.log("User inserted successfully");
        // res.json({ message: "User inserted successfully" });
        const { password, ...rest } = results;
        const acessToken = JWT.sign(
          {
            id: response.id,
            role: response.roles,
          },
          process.env.PASSTOKEN,
          { expiresIn: "5h" }
        );
        res.status(201).json({ ...rest, acessToken });
      }
    }
  );
});

// login
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const checkQuery = "SELECT id, password, username FROM users WHERE name = ?";

  connection.query(checkQuery, [name], (error, results) => {
    if (error) {
      // console.error("Error inserting user:", error);
      res.status(500).json({ error: "Error inserting user" });
    } else {
      const user = results[0];
      const hashedPassword = user.password;
      bcrypt.compare(password, hashedPassword, (compareError, isMatch) => {
        if (compareError) {
          console.error("Error comparing passwords:", compareError);
          res.status(500).json({ error: "Error comparing passwords" });
        } else if (isMatch) {
          const accessToken = jwt.sign(
            {
              id: user.id,
              userName: user.name,
            },
            process.env.PASSTOKEN,
            { expiresIn: "5h" }
          );
          res.status(200).json({ accessToken });
        } else {
          // Password doesn't match
          res.status(401).json({ error: "Invalid credentials" });
        }
      });
    }
  });
});
//
module.exports = router;
