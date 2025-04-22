const axios = require("axios");
const User = require("../models/user");

const gitPreviewData = async (username) => {
  try {
    if (username === null || username === "") throw new Error("Invalid link");

    let userData = await User.findById({ _id: username });
    if(userData){}
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

    console.log(repoData);
    // if(data){
    //     repoData = repoData.data.map((repo, index) => {
    //         return {
    //           _id: repo?.id,
    //           repoName: repo?.name,
    //           repositoryLink: repo?.html_url,
    //           deployedLink: repo?.homepage,
    //           description: repo?.description,
    //           stars: repo?.stargazers_count,
    //           visible: true,
    //         };
    //       });
    // }

    repoData = await axios.get(process.env.GIT_URL + "/" + username + "/repos",
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      });
    if (repoData.status === 400) {
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
    throw new Error("Invalid github username!");
  }
};

module.exports = gitPreviewData;
