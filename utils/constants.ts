export const REPOSITORY: string = process.env.GITHUB_REPOSITORY!;
export const [GITHUB_REPO_OWNER, GITHUB_REPO_NAME] =
  typeof REPOSITORY === "string" ? REPOSITORY.split("/") : [];
export const GOVERNOR_ADDRESS: string = process.env.GOVERNOR_ADDRESS!;
export const INFURA_API_KEY: string = process.env.INFURA_API_KEY!;
export const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY!;
export const DAO_NAME: string = process.env.DAO_NAME!;
