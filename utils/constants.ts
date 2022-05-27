// Always required
export const BLOCK_GAS_LIMIT = 30_000_000
export const RPC_URL = process.env.RPC_URL
export const TENDERLY_ACCESS_TOKEN = process.env.TENDERLY_ACCESS_TOKEN
export const TENDERLY_BASE_URL = `https://api.tenderly.co/api/v1`
export const TENDERLY_SIM_URL = `${TENDERLY_BASE_URL}/account/${process.env.TENDERLY_ACCOUNT}/project/${process.env.TENDERLY_PROJECT_SLUG}/simulate`
export const IPFS_GATEWAY = process.env.IPFS_GATEWAY
export const OMIT_CACHE = process.env.OMIT_CACHE === 'true'
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

// Only required to scan for new proposals and simulate with GitHub Actions
export const DAO_NAME = process.env.DAO_NAME

export const PROPOSAL_FILTER: number[] | null = process.env.PROPOSAL_FILTER
  ? JSON.parse(`[${process.env.PROPOSAL_FILTER.replace(/_/g, ',')}]`)
  : null

export const DAOs = {
  Aave: '0xEC568fffba86c094cf06b22134B23074DFE2252c',
} as const
