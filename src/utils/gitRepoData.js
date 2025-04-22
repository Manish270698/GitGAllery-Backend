const axios = require("axios");

const gitRepoData = async (username) => {
  try {
    if (username === null || username === "") {
      console.log("hello1");
      throw new Error("Invalid github username!");
    }
    console.log(
      "url getting called",
      process.env.GIT_URL + "/" + username + "/repos"
    );
    let repoData = await axios.get(
      process.env.GIT_URL + "/" + username + "/repos"
    );
    console.log(
      "url getting called",
      process.env.GIT_URL + "/" + username + "/repos"
    );
    if (repoData.status === 400) {
      console.log("hello2");
      throw new Error("Invalid github username!");
    }
    repoData = repoData.data.map((repo, index) => {
      return {
        _id: repo?.id,
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
    console.error(
      "GitHub API Error:",
      err.response ? err.response.data : err.message
    );
    throw new Error("Invalid github username!");
  }
};

module.exports = gitRepoData;
