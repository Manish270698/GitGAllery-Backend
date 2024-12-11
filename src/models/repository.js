const mongoose = require("mongoose");

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
    message: "Can't enter same skill more than once!",
  },
  {
    validator: function (val) {
      if (val.length > 5) {
        throw new Error();
      }
    },
    message: "Maximum 5 skills allowed!",
  },
];

const repositorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    repoName: {
      type: String,
      required: true,
    },
    repositoryLink: {
      type: String,
      required: true,
    },
    deployedLink: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
      maxLength: 200,
    },
    stars: {
      type: Number,
      required: true,
    },
    repoSkills: {
      type: [String],
      required: false,
      validate: many,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Repository = mongoose.model("Repository", repositorySchema);
module.exports = Repository;
