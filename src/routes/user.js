const express = require("express");
const gitRepoData = require("../utils/gitRepoData");
const userAuth = require("../middlewares/userAuth");
const User = require("../models/user");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { config } = require("dotenv");
const Repository = require("../models/repository");
const mongoose = require("mongoose");
config();

const userRouter = express.Router();

userRouter.get("/user/:username/view", async (req, res, next) => {
  try {
    let repoData = await gitRepoData(req.params.username);

    res.json({
      message: "Repository fetched",
      data: repoData,
    });
  } catch (err) {
    console.error("GitHub API Error:", err.message);
    res.status(400).send({ ERROR: err.message });
  }
});

userRouter.get("/user/:username/shared", async (req, res, next) => {
  try {
    const username = req.params.username;
    if (username === null || username === "") throw new Error("Invalid link");
    let userData;
    if (mongoose.isValidObjectId(username)) {
      userData = await User.findById({ _id: username });
    }
    let repoData;
    if (userData) {
      repoData = await Repository.find({ userId: username });
    } else {
      return res.status(404).send({ ERROR: "User not found!" });
    }

    const data = {
      name: userData.name || username,
      skills: userData.skills || [],
      repoData,
    };

    res.json({
      message: "Data fetched",
      data,
    });
  } catch (err) {
    res.status(400).send({ ERROR: err.message });
  }
});

// userRouter.get("/user/loggedIn/:id", userAuth, async (req, res, next) => {
//   try {
//     const data = await User.findById({ _id: req?.params?.id }).select(
//       "githubUserName"
//     );
//     let repoData;

//     console.log("githubUserName: ", data.githubUserName);

//     if (!data) {
//       if (req.body.githubUserName) {
//         repoData = await gitRepoData(data.githubUserName);
//       } else {
//         throw new Error("Invalid githubusername");
//       }
//     }

//     repoData = await gitRepoData(data.githubUserName);
//     res.json({
//       message: "Repository fetched from database.",
//       data: repoData,
//     });
//   } catch (err) {
//     res.status(400).send({ ERROR: err.message });
//   }
// });

userRouter.post("/user/forgotpassword", async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({
      $or: [{ userName: username }, { emailId: username }],
    });

    if (!user) {
      throw new Error("User doesn't exist!");
    }

    const resetToken = await user.getResetToken();
    await user.save();

    //Send token via email
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const message = `Click on the link to reset your password : ${url} within 15 minutes. Ignore if you haven't requested.`;
    await sendMail(user.emailId, "GitGallery password reset", message);

    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${user.emailId}`,
    });
  } catch (err) {
    res.status(400).send({ ERROR: err.message });
  }
});

userRouter.patch("/user/resetpassword/:token", async (req, res, next) => {
  try {
    const { token } = req.params;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Reset password link expired!");
    }
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    user.password = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Password changed sucessfully!`,
    });
  } catch (err) {
    res.status(400).send({ ERROR: err.message });
  }
});

module.exports = userRouter;
