/**
 * @notice Sample simulation configuration file for proposals that have been executed on chain.
 */
import { SimulationConfigExecuted } from '../types'

export const config: SimulationConfigExecuted = {
  type: 'executed',
  daoName: 'Compound',
  governorAddress: '0xc0Da02939E1441F497fd74F78cE7Decb17B66529',
  governorType: 'bravo',
  proposalId: 43,
}
