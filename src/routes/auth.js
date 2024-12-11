const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { config } = require("dotenv");
const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("../utils/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");
config();

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  try {
    let { githubUserName, emailId, name, password, skills } = req.body;
    await validateSignUpData(githubUserName, name, emailId, skills);
    const presentUser = await User.findOne({ emailId });
    if (presentUser) {
      throw new Error("An account with the provided email already exists!");
    }

    if (!name || name.length === 0) name = githubUserName;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      githubUserName,
      name,
      emailId,
      password: passwordHash,
      skills,
    });
    await user.save();
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 168 * 3600000), //expires after 168 hours/ 7 days
      httpOnly: true,
    });
    res.json({
      message: "Signed up successfully.",
      user: {
        githubUserName,
        name,
        emailId,
        skills,
      },
    });
  } catch (err) {
    res.status(400).send({ ERROR: err.message });
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      $or: [{ githubUserName: username }, { emailId: username }],
    });
    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isPasswordValid = await user.validateUser(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 168 * 3600000), //expires after 168 hours/ 7 days
        httpOnly: true,
      });

      res.json({
        message: "Login Successful!",
        user: {
          githubUserName: user.githubUserName,
          name: user.name,
          emailId: user.emailId,
          skills: user.skills,
        },
      });
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).send({ ERROR: err.message });
  }
});

authRouter.post("/signout", (req, res, next) => {
  try {
    res.cookie("token", "", { expires: new Date(Date.now()), httpOnly: true });
    res.send("Logout successfull.");
  } catch (err) {
    res.status(400).send({ ERROR: err.message });
  }
});

module.exports = authRouter;
