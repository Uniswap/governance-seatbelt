export const REPOSITORY: string = process.env.GITHUB_REPOSITORY!
export const [GITHUB_REPO_OWNER, GITHUB_REPO_NAME] = typeof REPOSITORY === 'string' ? REPOSITORY.split('/') : []
export const RPC_URL: string = process.env.RPC_URL!
export const REPORTS_BRANCH = 'reports'
export const RUNNING_LOCALLY = Boolean(process.env.RUNNING_LOCALLY) // use 1 or 0 because Boolean('false') = true
export const TENDERLY_URL = `https://api.tenderly.co/api/v1/account/me/project/${process.env.TENDERLY_PROJECT_SLUG}/simulate`
export const TENDERLY_ACCESS_TOKEN: string = process.env.TENDERLY_ACCESS_TOKEN!
export const SIM_NAME: string = process.env.SIM_NAME!
