/**
 * @notice Simulation configuration file for ArbOS 11 upgrade
 */
import { ethers } from 'ethers'
import { SimulationConfigNew } from '../types'

const ARBSYS = '0x0000000000000000000000000000000000000064'
export const generateCoreGovSimConfig = (callData: string, simDescription: string, value = 0) => {
  const upgrade = {
    arbSysSendTxToL1Args: {
      l1Timelock: '0xE6841D92B0C345144506576eC13ECf5103aC7f49',
      calldata: callData,
    },
  }
  const iface = new ethers.utils.Interface(['function sendTxToL1(address,bytes)'])
  const calldata = iface.encodeFunctionData('sendTxToL1', [
    upgrade.arbSysSendTxToL1Args.l1Timelock,
    upgrade.arbSysSendTxToL1Args.calldata,
  ])

  const call1 = {
    target: ARBSYS,
    calldata: calldata,
    value,
    signature: '',
  }

  const config: SimulationConfigNew = {
    type: 'new',
    daoName: 'ArbCore',
    governorType: 'arb',
    governorAddress: '0xf07ded9dc292157749b6fd268e37df6ea38395b9',
    targets: [call1.target], // Array of targets to call.
    values: [call1.value], // Array of values with each call.
    signatures: [call1.signature], // Array of function signatures. Leave empty if generating calldata with ethers like we do here.
    calldatas: [call1.calldata], // Array of encoded calldatas.
    description: simDescription,
  }
  return config
}

export const generateNonEmergencySCSimConfig = (callData: string, simDescription: string, value = 0) => {
  const call1 = {
    target: ARBSYS,
    calldata: callData,
    value,
    signature: '',
  }

  const config: SimulationConfigNew = {
    type: 'new',
    daoName: 'ArbCore',
    governorType: 'arb',
    governorAddress: '0xf07ded9dc292157749b6fd268e37df6ea38395b9',
    targets: [call1.target], // Array of targets to call.
    values: [call1.value], // Array of values with each call.
    signatures: [call1.signature], // Array of function signatures. Leave empty if generating calldata with ethers like we do here.
    calldatas: [call1.calldata], // Array of encoded calldatas.
    description: simDescription,
  }
  return config
}
