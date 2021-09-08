import { Octokit } from "@octokit/action";

const [owner, repo] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const octokit = new Octokit();

async function main() {
  const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner,
    repo,
    title: "My test issue",
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
