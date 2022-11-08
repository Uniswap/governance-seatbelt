import dotenv from 'dotenv'
dotenv.config()

// Load environment variables.
export const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY!
export const RPC_URL: string = process.env.RPC_URL!
export const TENDERLY_ACCESS_TOKEN: string = process.env.TENDERLY_ACCESS_TOKEN!
export const TENDERLY_USER: string = process.env.TENDERLY_USER!
export const TENDERLY_PROJECT_SLUG: string = process.env.TENDERLY_PROJECT_SLUG!
console.log('TENDERLY_USER: ', TENDERLY_USER);

// Validate them.
if (!ETHERSCAN_API_KEY) throw new Error('ETHERSCAN_API_KEY is not defined')
if (!RPC_URL) throw new Error('RPC_URL is not defined')
if (!TENDERLY_ACCESS_TOKEN) throw new Error('TENDERLY_ACCESS_TOKEN is not defined')
if (!TENDERLY_USER) throw new Error('TENDERLY_USER is not defined')
if (!TENDERLY_PROJECT_SLUG) throw new Error('TENDERLY_PROJECT_SLUG is not defined')

// Define the constants.
export const BLOCK_GAS_LIMIT = 30_000_000
export const TENDERLY_BASE_URL = `https://api.tenderly.co/api/v1`
export const TENDERLY_ENCODE_URL = `${TENDERLY_BASE_URL}/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT_SLUG}/contracts/encode-states`
export const TENDERLY_SIM_URL = `${TENDERLY_BASE_URL}/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT_SLUG}/simulate`

// Only required when running a specific sim from a config file
// Note that if SIM_NAME is defined, that simulation takes precedence over scanning mode with GitHub Actions
export const SIM_NAME = process.env.SIM_NAME ? process.env.SIM_NAME : null

// Only required to scan for new proposals and simulate with GitHub Actions
export const DAO_NAME = process.env.DAO_NAME ? process.env.DAO_NAME : null
export const GOVERNOR_ADDRESS = process.env.GOVERNOR_ADDRESS ? process.env.GOVERNOR_ADDRESS : null
export const REPORTS_BRANCH = 'reports'
