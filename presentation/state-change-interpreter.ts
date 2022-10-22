import { BigNumber, providers } from 'ethers'
import { hexDataLength, hexDataSlice, hexZeroPad } from 'ethers/lib/utils'
import { ProposalData } from '../types'
import { erc20Contract } from '../utils/contracts/erc-20'
import * as pools from '@bgd-labs/aave-address-book'

export function deepDiff(
  before: Record<string, any> | string,
  after: Record<string, any> | string,
  prefix?: string
): string {
  if (typeof before !== 'object' || typeof after !== 'object') {
    return `${prefix ? `@@ ${prefix} @@\n` : ''}- ${before}
+ ${after}\n`
  }
  return Object.keys(before).reduce((acc, key) => {
    if (before[key] === after[key]) return acc
    if (typeof before[key] === 'object') return deepDiff(before[key], after[key], prefix ? `${prefix}.${key}` : key)
    return (
      acc +
      `@@ ${prefix ? `${prefix}.${key}` : key} @@
- ${before[key]}
+ ${after[key]}\n`
    )
  }, '')
}

export async function interpretStateChange(
  contractAddress: string,
  name: string = '',
  original: Record<string, any>,
  dirty: Record<string, any>,
  key: string,
  deps: ProposalData
) {
  if (name === '_reserves' && (original.configuration.data || dirty.configuration.data))
    return await reserveConfigurationChanged(contractAddress, original, dirty, key, deps)
  return undefined
}

// struct ReserveConfigurationMap {
//   //bit 0-15: LTV
//   //bit 16-31: Liq. threshold
//   //bit 32-47: Liq. bonus
//   //bit 48-55: Decimals
//   //bit 56: Reserve is active
//   //bit 57: reserve is frozen
//   //bit 58: borrowing is enabled
//   //bit 59: stable rate borrowing enabled
//   //bit 60-63: reserved
//   //bit 64-79: reserve factor
//   uint256 data;
// }
/**
 * There's probably a nicer way to do this in ethers.
 * @param config number
 * @param fromBits inclusive
 * @param toBits exclusive
 * @returns value between bit range
 */
export function getBits(config: string, fromBits: number, toBits: number) {
  if (config === '0') return 0
  const configU256 = hexZeroPad(BigNumber.from(config).toHexString(), 32)
  let shl = BigNumber.from(configU256)
    .shl(256 - toBits)
    .toHexString()
  if (hexDataLength(shl) < 32) shl = hexZeroPad(shl, 32)
  const slice = hexDataSlice(shl, hexDataLength(shl) - 32, hexDataLength(shl))
  const value = BigNumber.from(slice).shr(256 - toBits + fromBits)
  return value.toString()
}

async function reserveConfigurationChanged(
  contractAddress: string,
  original: Record<string, any>,
  dirty: Record<string, any>,
  key: string,
  deps: ProposalData
) {
  const configurationBefore = getDecodedReserveData(contractAddress, original.configuration.data)
  const configurationAfter = getDecodedReserveData(contractAddress, dirty.configuration.data)
  let symbol = 'unknown'
  try {
    symbol = await erc20Contract(key, deps.provider).symbol()
  } catch (e) {}
  // const symbol =
  return `# decoded configuration.data for key \`${key}\` (symbol: ${symbol})
${deepDiff(configurationBefore, configurationAfter, 'configuration.data')}`
}

function getDecodedReserveData(contractAddress: string, data?: any) {
  if (!data) return {}
  if (
    [pools.AaveV2EthereumAMM.POOL, pools.AaveV2Ethereum.POOL, pools.AaveV2Polygon.POOL, pools.AaveV2Avalanche.POOL]
      .map((address) => address.toLowerCase())
      .includes(contractAddress.toLowerCase())
  )
    return decodeReserveDataV2(data)
  return decodeReserveDataV3(data)
}

export function decodeReserveDataV2(data: string) {
  const ltv = getBits(data, 0, 16)
  const liquidationThreshold = getBits(data, 16, 32)
  const liquidationBonus = getBits(data, 32, 48)
  const decimals = getBits(data, 48, 56)
  const active = BigNumber.from(getBits(data, 56, 57)).toNumber()
  const frozen = BigNumber.from(getBits(data, 57, 58)).toNumber()
  const borrowingEnabled = BigNumber.from(getBits(data, 58, 59)).toNumber()
  const reserveFactor = getBits(data, 64, 80)
  return {
    ltv,
    liquidationThreshold,
    liquidationBonus,
    decimals,
    active: !!active,
    frozen: !!frozen,
    borrowingEnabled: !!borrowingEnabled,
    reserveFactor,
  }
}

export function decodeReserveDataV3(data: string) {
  const ltv = getBits(data, 0, 16)
  const liquidationThreshold = getBits(data, 16, 32)
  const liquidationBonus = getBits(data, 32, 48)
  const decimals = getBits(data, 48, 56)
  const active = BigNumber.from(getBits(data, 56, 57)).toNumber()
  const frozen = BigNumber.from(getBits(data, 57, 58)).toNumber()
  const borrowingEnabled = BigNumber.from(getBits(data, 58, 59)).toNumber()
  const stableRateBorrowingEnabled = BigNumber.from(getBits(data, 59, 60)).toNumber()
  const paused = BigNumber.from(getBits(data, 60, 61)).toNumber()
  const borrowingInIsolation = BigNumber.from(getBits(data, 61, 62)).toNumber()
  const reserveFactor = getBits(data, 64, 80)
  const borrowCap = getBits(data, 80, 116)
  const supplyCap = getBits(data, 116, 152)
  const liquidationProtocolFee = getBits(data, 152, 168)
  const eModeCategory = getBits(data, 168, 176)
  const unbackedMintCap = getBits(data, 176, 212)
  const debtCeiling = getBits(data, 212, 252)

  return {
    ltv,
    liquidationThreshold,
    liquidationBonus,
    decimals,
    active: !!active,
    frozen: !!frozen,
    borrowingEnabled: !!borrowingEnabled,
    stableRateBorrowingEnabled,
    paused,
    borrowingInIsolation,
    reserveFactor,
    borrowCap,
    supplyCap,
    liquidationProtocolFee,
    eModeCategory,
    unbackedMintCap,
    debtCeiling,
  }
}
