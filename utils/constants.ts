// Always required
export const BLOCK_GAS_LIMIT = 30_000_000
export const RPC_URL = process.env.RPC_URL
export const RPC_POLYGON = process.env.RPC_POLYGON
export const TENDERLY_ACCESS_TOKEN = process.env.TENDERLY_ACCESS_TOKEN
export const TENDERLY_BASE_URL = `https://api.tenderly.co/api/v1`

// fork setup
export const TENDERLY_ROOT = process.env.TENDERLY_ROOT
export const TENDERLY_SIM_URL = `${TENDERLY_BASE_URL}/account/${process.env.TENDERLY_ACCOUNT}/project/${process.env.TENDERLY_PROJECT_SLUG}/simulate`

export const IPFS_GATEWAY = process.env.IPFS_GATEWAY
export const OMIT_CACHE = process.env.OMIT_CACHE === 'true'
export const FORCE_SIMULATION = process.env.FORCE_SIMULATION === 'true'
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

// Only required to scan for new proposals and simulate with GitHub Actions
export const DAO_NAME = process.env.DAO_NAME

export const PROPOSAL_FILTER: number[] | null = process.env.PROPOSAL_FILTER
  ? JSON.parse(`[${process.env.PROPOSAL_FILTER.replace(/_/g, ',')}]`)
  : null

export const DAOs = {
  Aave: '0xEC568fffba86c094cf06b22134B23074DFE2252c',
} as const

export const FROM = '0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073' // arbitrary EOA not used on-chain

// make sure env variables are set
if (!DAOs[DAO_NAME as keyof typeof DAOs]) {
  throw new Error(`DAO_NAME:${DAO_NAME} unknown. Must be one of ${Object.keys(DAOs).join(',')}`)
}
export const AAVE_GOV_V2_ADDRESS = DAOs[DAO_NAME as keyof typeof DAOs]
