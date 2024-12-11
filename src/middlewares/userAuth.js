const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid token!");
    }
    const loggedInUser = await jwt.verify(token, process.env.JWT_PASSWORD);
    const user = await User.findById(loggedInUser._id);
    if (!user) {
      throw new Error("Invalid token!");
    }
    req.user = user;
    req.loggedInUser = loggedInUser._id;
    next();
  } catch (err) {
    res.status(401).send("ERROR: " + err.message);
  }
};

module.exports = userAuth;
