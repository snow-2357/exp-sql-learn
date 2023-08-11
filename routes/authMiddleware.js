const JWT = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    JWT.verify(token, process.env.PASSTOKEN, (err, user) => {
      if (err) res.status(400).json({ status: "Token is not valid!" });
      // task check in database
      if (user) next();
    });
  } else {
    return res.status(401).json({ status: "Not authorize" });
  }
};

module.exports = { verifyUser };
