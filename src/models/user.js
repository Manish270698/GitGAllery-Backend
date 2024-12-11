const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { isStrongPassword, trim } = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");
const bcrypt = require("bcrypt");
const { config } = require("dotenv");
config();
const crypto = require("crypto");

const checkDuplicate = (val) => {
  val = val.map((ele) => ele.trim().toLowerCase());
  const set = new Set(val);
  if (set.size != val.length) {
    throw new Error();
  }
};

// skills validators
const many = [
  {
    validator: checkDuplicate,
    message: "Can't enter same skill more than once!!",
  },
  {
    validator: function (val) {
      if (val.length > 5) {
        throw new Error();
      }
    },
    message: "Maximum top 5 skills allowed!",
  },
];

const userSchema = new mongoose.Schema(
  {
    githubUserName: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
      minLength: 3,
      maxLength: 30,
      trim: true,
    },
    emailId: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      validate: {
        validator(value) {
          if (!isEmail(value)) {
            throw new Error("Entered email is not valid!");
          }
        },
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!isStrongPassword(value)) {
          throw new Error("Please enter a strong password!");
        }
      },
    },
    skills: {
      type: [String],
      trim: true,
      validate: many,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

userSchema.methods.validateUser = async function (passwordInputByUser) {
  const passwordHash = this.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

userSchema.methods.getJWT = async function () {
  const token = jwt.sign(
    { _id: this.id, githubUserName: this.githubUserName },
    process.env.JWT_PASSWORD,
    { expiresIn: "7d" }
  );

  return token;
};

userSchema.methods.getResetToken = async function () {
  const resetToken = crypto.randomBytes(15).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
