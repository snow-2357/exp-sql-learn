const JWT = require("jsonwebtoken");

const jwtSign = (id, userName, exp) => {
  return JWT.sign(
    {
      id,
      userName,
    },
    process.env.PASSTOKEN,
    {
      expiresIn: exp,
    }
  );
};

module.exports = { jwtSign };
