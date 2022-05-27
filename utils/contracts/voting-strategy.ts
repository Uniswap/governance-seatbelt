import { Contract } from 'ethers'
import { provider } from '../clients/ethers'

const VOTING_STRATEGY_ABI = [
    "function AAVE() view returns (address)",
    "function STK_AAVE() view returns (address)",
    "function getPropositionPowerAt(address,uint256) view returns (uint256)",
    "function getTotalPropositionSupplyAt(uint256) view returns (uint256)",
    "function getTotalVotingSupplyAt(uint256) view returns (uint256)",
    "function getVotingPowerAt(address,uint256) view returns (uint256)"
]

export const votingStrategy = (address: string) => new Contract(address, VOTING_STRATEGY_ABI, provider)