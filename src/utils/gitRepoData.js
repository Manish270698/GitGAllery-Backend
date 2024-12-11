const axios = require("axios");

const gitRepoData = async (username) => {
  try {
    let repoData = await axios.get(
      process.env.GIT_URL + "/" + username + "/repos"
    );
    if (repoData.status === 400) {
      throw new Error("Invalid github username!");
    }
    repoData = repoData.data.map((repo, index) => {
      return {
        id: repo?.id,
        repoName: repo?.name,
        repositoryLink: repo?.html_url,
        deployedLink: repo?.homepage,
        description: repo?.description,
        stars: repo?.stargazers_count,
        visible: true,
      };
    });

    return repoData;
  } catch (err) {
    throw new Error("Invalid github username!");
  }
};

module.exports = gitRepoData;
