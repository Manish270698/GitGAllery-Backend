const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { validateSaveData } = require("../utils/validate");
const User = require("../models/user");
const Repository = require("../models/repository");

const profileRouter = express.Router();

profileRouter.post(
  "/profile/loggedIn/:id/save",
  userAuth,
  async (req, res, next) => {
    try {
      const data = req.body.data;
      if (data.length !== 2) {
        throw new Error("Invalid operation!");
      }

      const loggedInUser = req.loggedInUser;

      await validateSaveData(data, loggedInUser);

      const user = await User.updateOne(
        { _id: loggedInUser },
        {
          $set: data[0][0],
        }
      );

      if (!user.acknowledged) {
        throw new Error("Error while updating the data. Please try again!");
      }

      await Repository.deleteMany({ userId: loggedInUser });
      const repoData = await Repository.insertMany(data[1]);

      res.json({ message: "Data updated successfully!" });
    } catch (err) {
      res.status(400).send({ ERROR: err.message });
    }
  }
);

profileRouter.get(
  "/profile/loggedIn/:id/view",
  userAuth,
  async (req, res, next) => {
    try {
      const repoData = await Repository.find({ userId: req.loggedInUser }).sort(
        { position: 1 }
      );
      res.json({
        message: "Data fetched successfully",
        data: repoData,
      });
    } catch (err) {
      res.status(400).send({ ERROR: err.message });
    }
  }
);

module.exports = profileRouter;
