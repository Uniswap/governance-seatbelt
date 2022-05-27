import { BigNumber } from 'ethers'
import { hexDataLength, hexDataSlice, hexZeroPad } from 'ethers/lib/utils'

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

export function interpretStateChange(name: string = '', original: Record<string, any>, dirty: Record<string, any>) {
  if (name === '_reserves' && (original.configuration.data || dirty.configuration.data))
    return reserveConfigurationChanged(original, dirty)
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

export function decodeReserveData(data: string) {
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

function reserveConfigurationChanged(original: Record<string, any>, dirty: Record<string, any>) {
  const configurationBefore = original.configuration.data ? decodeReserveData(original.configuration.data) : {}
  const configurationAfter = dirty.configuration.data ? decodeReserveData(dirty.configuration.data) : {}
  return `# decoded configuration.data
${deepDiff(configurationBefore, configurationAfter, 'configuration.data')}`
}
