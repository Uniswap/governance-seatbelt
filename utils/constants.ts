// Always required
export const BLOCK_GAS_LIMIT = 30_000_000
export const RPC_URL: string = process.env.RPC_URL!
export const RUNNING_LOCALLY = [0, '0', false, 'false'].includes(process.env.RUNNING_LOCALLY!) ? false : true
export const TENDERLY_ACCESS_TOKEN: string = process.env.TENDERLY_ACCESS_TOKEN!
export const TENDERLY_URL = `https://api.tenderly.co/api/v1/account/me/project/${process.env.TENDERLY_PROJECT_SLUG}/simulate`

// Only required when running a specific sim from a config file
// Note that if SIM_NAME is defined, that simulation takes precedence over scanning mode with GitHub Actions
export const SIM_NAME = process.env.SIM_NAME ? process.env.SIM_NAME : null

// Only required to scan for new proposals and simulate with GitHub Actions
export const DAO_NAME = process.env.DAO_NAME ? process.env.DAO_NAME : null
export const GOVERNOR_ADDRESS = process.env.GOVERNOR_ADDRESS ? process.env.GOVERNOR_ADDRESS : null
export const REPORTS_BRANCH = 'reports'
export const REPOSITORY = 'Uniswap/governance-seatbelt'
export const SIM_ALL = [0, '0', false, 'false'].includes(process.env.SIM_ALL!) ? false : true
export const [GITHUB_REPO_OWNER, GITHUB_REPO_NAME] = typeof REPOSITORY === 'string' ? REPOSITORY.split('/') : []
