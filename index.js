const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios").default;

async function main() {
  const incomingWebHookURL = core.getInput("incoming-webhook-url");
  const releaseNotes = core.getInput("content-body");
  const cfg = {
    headers: { "Content-Type": "application/json" },
  };
  let tagName = github.context.ref;

  if (!tagName.startsWith("refs/tags/")) {
    const msg = "This action is designed to be used for releases ... skipping";
    console.error(msg);
    return;
  }

  tagName = tagName.replace("refs/tags/", "");

  const repositoryName = github.context.repo.repo;
  const author = github.context.actor;

  const requestBody = {
    text: "Production Deployment",
    blocks: [
      {
        type: "header",
        text: {
          type: "mrkdwn",
          text: `\`${repositoryName}\`: \`${tagName}\``,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Author: ${author}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `\`\`\`
		 ${releaseNotes}
		  \`\`\`
		  `,
        },
      },
    ],
  };

  await axios.post(incomingWebHookURL, JSON.stringify(requestBody), cfg);
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
