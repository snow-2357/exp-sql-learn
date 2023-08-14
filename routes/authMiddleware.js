const JWT = require("jsonwebtoken");
const connection = require("../mysql");

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    JWT.verify(token, process.env.PASSTOKEN, (err, data) => {
      if (err) res.status(400).json({ status: "Token is not valid!" });
      // task check in database
      const checkQuery = "SELECT * FROM users WHERE id = ?";

      connection.query(checkQuery, [data.id], (err, results) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        req.userId = data.id;
        next();
      });
    });
  } else {
    return res.status(401).json({ status: "Not authorize" });
  }
};

const verifyIndividualUser = (req, res, next) => {
  const authHeader = req.headers.token;
  const userId = req.params.id;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    JWT.verify(token, process.env.PASSTOKEN, (err, data) => {
      if (err) res.status(400).json({ status: "Token is not valid!" });
      // task check in database
      const checkQuery = "SELECT * FROM users WHERE id = ?";

      connection.query(checkQuery, [data.id], (err, results) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        console.log(results[0].id, userId);

        if (results[0].id != userId) {
          return res.status(401).json({
            error: "User dont have the authentication for other users data",
          });
        }
        next();
      });
    });
  } else {
    return res.status(401).json({ status: "Not authorize" });
  }
};

module.exports = { verifyUser, verifyIndividualUser };
