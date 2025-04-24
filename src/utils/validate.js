const { default: isEmail } = require("validator/lib/isEmail");
const gitAuth = require("./gitAuth");
const {
  USER_SAVE_SAFE_FIELDS,
  REPO_SAVE_SAFE_FIELDS,
} = require("../constants");
const { default: isURL } = require("validator/lib/isURL");

const validateSignUpData = async (userName, name, emailId, skills) => {
  console.log("userName: ", userName, userName.length);
  console.log("name: ", name, name.length);
  console.log("emailId: ", emailId, emailId.length);
  console.log("skills: ", skills);
  if (userName && userName.trim().length >= 1 && userName.trim().length < 3) {
    throw new Error("Username should be atleast 3 characters long!");
  } else if (
    userName &&
    userName.trim().length >= 1 &&
    userName.trim().length > 15
  ) {
    throw new Error("Max lenth of username should be 15!");
  } else if (name && name.trim().length >= 1 && name.trim().length < 3) {
    throw new Error("Name should be atleast 3 characters long!");
  } else if (name && name.trim().length >= 1 && name.trim().length > 30) {
    throw new Error("Max length of name should be 30!");
  } else if (!emailId && !isEmail(emailId)) {
    throw new Error("Email id is not valid!");
  } else if (emailId.length === 0) {
    throw new Error("Please enter your email id!");
  } else if (skills && skills.length > 0 && skills.length < 3) {
    throw new Error("Enter at least 3 of your top skills!");
  } else if (
    skills &&
    new Set(skills.map((e) => e.toLowerCase())).size !==
      skills.map((e) => e.toLowerCase()).length
  ) {
    throw new Error("Duplicate skills not allowed!");
  }
};

const validateSaveData = async (data, loggedInUser) => {
  const userData = data[0];
  const repoData = data[1];
  if (data[0].length !== 1) {
    throw new Error("Update not allowed!");
  }
  const isUserUpdateAllowed = userData.every((obj) =>
    Object.keys(obj).every((field) => USER_SAVE_SAFE_FIELDS.includes(field))
  );
  const isRepoUpdateAllowed = repoData.every((obj) =>
    Object.entries(obj).every(([key, value]) => {
      if (key === "userId") {
        if (value !== loggedInUser) throw new Error("Update not allowed!");
      }
      return REPO_SAVE_SAFE_FIELDS.includes(key);
    })
  );
  if (!isUserUpdateAllowed || !isRepoUpdateAllowed) {
    throw new Error("Update not allowed!");
  }
  for (const obj of userData) {
    const { name, skills } = obj;
    if (name && name.trim().length < 3) {
      throw new Error("Name should be at least 3 characters long!");
    } else if (name && name.trim().length > 30) {
      throw new Error("Max length of name should be 30!");
    } else if (skills && skills.length > 0 && skills.length < 3) {
      throw new Error("Enter at least 3 top skills!");
    } else if (skills.length > 5) {
      throw new Error("Maximum 5 top skills allowed!");
    } else if (
      skills &&
      skills.length > 0 &&
      new Set(skills).size !== skills.map((e) => e.toLowerCase()).length
    ) {
      throw new Error("Duplicate skills not allowed!");
    }
  }
  for (const repo of repoData) {
    const { repoName, repositoryLink, deployedLink, description, repoSkills } =
      repo;
    if (repoName.length > 100) {
      throw new Error(
        "Maximum allowed length of repository name is 100 characters!"
      );
    } else if (repositoryLink && !isURL(repositoryLink)) {
      throw new Error("Invalid repository link entered!");
    } else if (deployedLink && !isURL(deployedLink)) {
      throw new Error("Invalid deployment link entered!");
    } else if (description && description.length > 200) {
      throw new Error(
        "Maximum allowed length of description is 200 characters!"
      );
    } else if (repoSkills && repoSkills.length > 0 && repoSkills.length < 2) {
      throw new Error("Enter at least 2 skills or no skills for a repository!");
    } else if (repoSkills.length > 5) {
      throw new Error("Maximum 5 skills allowed for a single repository!");
    } else if (
      repoSkills &&
      repoSkills.length > 0 &&
      new Set(repoSkills).size !== repoSkills.map((e) => e.toLowerCase()).length
    ) {
      throw new Error("Duplicate repository skills are not allowed!");
    }
  }
};
module.exports = { validateSignUpData, validateSaveData };
