const USER_SAVE_SAFE_FIELDS = ["name", "skills"];
const REPO_SAVE_SAFE_FIELDS = [
  "userId",
  "repoName",
  "repositoryLink",
  "deployedLink",
  "description",
  "stars",
  "repoSkills",
  "visible",
  "position",
];

module.exports = {
  USER_SAVE_SAFE_FIELDS,
  REPO_SAVE_SAFE_FIELDS,
};
