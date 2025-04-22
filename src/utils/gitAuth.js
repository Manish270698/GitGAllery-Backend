const { default: axios } = require("axios");
const { config } = require("dotenv");
config();

const gitAuth = async (githubUserName) => {
  try {
    const gitData = await axios.get(
      process.env.GIT_URL + "/" + githubUserName,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    if (gitData.status === 400) {
      throw new Error("Invalid github username!");
    }
  } catch (err) {
    throw new Error("Invalid github username!");
  }
};

module.exports = gitAuth;
