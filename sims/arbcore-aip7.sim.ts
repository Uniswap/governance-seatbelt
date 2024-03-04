/**
 * @notice Simulation configuration file for AIP 7
 */
import { ethers } from 'ethers'
import { SimulationConfigNew } from '../types'

const ARBSYS = '0x0000000000000000000000000000000000000064'


// from https://github.com/ArbitrumFoundation/governance/blob/4d59e726e2836be325ca89928ca2d66308faefff/scripts/proposals/AIP7/data/42161-AIP7-data.json
const aip4 = {
  arbSysSendTxToL1Args: {
    l1Timelock: '0xE6841D92B0C345144506576eC13ECf5103aC7f49',
    calldata:
      '0x8f2a0bb000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000000d8f89f9f53c79fc7bf389cd37f76d8b2a56855078ca9c102bb8fda9978b5f529000000000000000000000000000000000000000000000000000000000003f4800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000a723c008e76e379c55599d2e4d93879beafda79c000000000000000000000000a723c008e76e379c55599d2e4d93879beafda79c0000000000000000000000003fffbadaf827559da092217e474760e2b2c3cedd000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000001800000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd0000000000000000000000007b1247f443359d1447cf25e73380bc9b99f2628f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001800000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000baba4daf5800b9746f58c724f05e03880850d57800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  },
}
const iface = new ethers.utils.Interface(['function sendTxToL1(address,bytes)'])
const calldata = iface.encodeFunctionData('sendTxToL1', [
  aip4.arbSysSendTxToL1Args.l1Timelock,
  aip4.arbSysSendTxToL1Args.calldata,
])

const call1 = {
  target: ARBSYS,
  calldata: calldata,
  value: 0,
  signature: '',
}

export const config: SimulationConfigNew = {
  type: 'new',
  daoName: 'ArbCore',
  governorType: 'arb',
  governorAddress: '0xf07ded9dc292157749b6fd268e37df6ea38395b9',
  targets: [call1.target], // Array of targets to call.
  values: [call1.value], // Array of values with each call.
  signatures: [call1.signature], // Array of function signatures. Leave empty if generating calldata with ethers like we do here.
  calldatas: [call1.calldata], // Array of encoded calldatas.
  description: 'AIP7 Simulation',
}