import { BigNumber } from 'ethers'
import { decodeReserveData, getBits } from './state-change-interpreter'

describe('stateChangeInterpreter', () => {
  it('should properly decode the data field on aave-v2 stETH', () => {
    const params = decodeReserveData('18446821244024599616244')
    expect(params.ltv).toBe('6900')
    expect(params.liquidationThreshold).toBe('8100')
    expect(params.liquidationBonus).toBe('10750')
    expect(params.decimals).toBe('18')
    expect(params.active).toBe(true)
    expect(params.frozen).toBe(false)
    expect(params.borrowingEnabled).toBe(false)
    expect(params.reserveFactor).toBe('1000')
  })
  it('should properly decode the data field on aave-v2 AAVE', () => {
    const data = '77171388684964744'
    const ltv = getBits(data, 0, 16)
    const liquidationThreshold = getBits(data, 16, 32)
    const liquidationBonus = getBits(data, 32, 48)
    const decimals = getBits(data, 48, 56)
    const active = BigNumber.from(getBits(data, 56, 57)).toNumber()
    const frozen = BigNumber.from(getBits(data, 57, 58)).toNumber()
    const borrowingEnabled = BigNumber.from(getBits(data, 58, 59)).toNumber()
    const reserveFactor = getBits(data, 64, 80)
    expect(ltv).toBe('5000')
    expect(liquidationThreshold).toBe('6500')
    expect(liquidationBonus).toBe('11000')
    expect(decimals).toBe('18')
    expect(active).toBe(1)
    expect(frozen).toBe(0)
    expect(borrowingEnabled).toBe(0)
    expect(reserveFactor).toBe('0')
  })
})
