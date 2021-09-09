export const [GITHUB_REPO_OWNER, GITHUB_REPO_NAME] =
  process.env.GITHUB_REPOSITORY?.split("/") ?? [];
export const GOVERNOR_ADDRESS = process.env.GOVERNOR_ADDRESS;
export const INFURA_API_KEY = process.env.INFURA_API_KEY;
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
