require('dotenv').config()
import '@nomiclabs/hardhat-ethers'
import { RPC_URL } from './utils/constants'

export default {
  networks: {
    hardhat: {
      forking: {
        url: RPC_URL,
        blockNumber: 12266839, // TODO this is tailored for Compound proposal 43, but lets generalize it
      },
    },
  },
  solidity: {
    version: '0.5.17',
    settings: { optimizer: { enabled: false } }, // optimizer off for conservative gas usage estimates
  },
}
