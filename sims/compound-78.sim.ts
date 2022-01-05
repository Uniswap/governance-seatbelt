/**
 * @notice Sample simulation configuration file for proposals that have been executed on chain
 */
import { SimulationConfigProposed } from '../types'

export const config: SimulationConfigProposed = {
  type: 'proposed',
  daoName: 'Compound',
  governorAddress: '0xc0Da02939E1441F497fd74F78cE7Decb17B66529',
  proposalId: 76,
}
