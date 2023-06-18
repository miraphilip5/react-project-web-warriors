require('dotenv').config()
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //get the token from header
  const token = req.header("x-auth-token");

  //check if token is there
  if (!token) {
    return res.status(400).json({ msg: "no token authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
