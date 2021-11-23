export const REPOSITORY: string = process.env.GITHUB_REPOSITORY!
export const [GITHUB_REPO_OWNER, GITHUB_REPO_NAME] = typeof REPOSITORY === 'string' ? REPOSITORY.split('/') : []
export const GOVERNOR_ADDRESS: string = process.env.GOVERNOR_ADDRESS!
export const RPC_URL: string = process.env.RPC_URL!
export const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY!
export const DAO_NAME: string = process.env.DAO_NAME!
export const REPORTS_BRANCH = 'reports'
export const RUNNING_LOCALLY = Boolean(process.env.RUNNING_LOCALLY) // use 1 or 0 because Boolean('false') = true

// Mapping from opcode name to which stack element it consumes as the address
export const OPCODE_MAP = {
  BALANCE: 1,
  CALL: 2,
  CALLCODE: 2,
  DELEGATECALL: 2,
  EXTCODECOPY: 1,
  EXTCODEHASH: 1,
  EXTCODESIZE: 1,
  SELFDESTRUCT: 1,
  STATICCALL: 2,
}
