import { FunctionFragment, Interface } from '@ethersproject/abi'
import { getContractNameAndAbiFromFile } from './abi-utils'
import { CometChains } from './compound-types'

export async function getDecodedCallData(args: {
  chain: CometChains
  target: string
  signature: string
  calldata: string
  sentMessageSignature: string
}) {
  const { chain, target, signature, calldata, sentMessageSignature } = args
  const contractNameAndAbi = await getContractNameAndAbiFromFile(chain, target)
  const iface = new Interface(contractNameAndAbi.abi)
  const fun = iface.getFunction(signature)
  const decodedCalldata = iface._decodeParams(fun.inputs, calldata)
  const functionSignature = getFunctionSignature(fun)
  if (functionSignature !== sentMessageSignature) {
    throw new Error(`Function signature is not ${sentMessageSignature}. It is ${functionSignature}`)
  }
  return decodedCalldata
}

export function getFunctionSignature(fun: FunctionFragment) {
  return `${fun.name}(${fun.inputs.map((input) => input.type).join(',')})`
}
