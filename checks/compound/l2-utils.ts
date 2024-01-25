import { AbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { getDecodedCallData } from './calldata-decode-util'
import { CometChains, ExecuteTransactionsInfo } from './compound-types'

async function getDecodedBytesForArbitrum(
  target: string,
  signature: string,
  calldata: string,
): Promise<ExecuteTransactionsInfo> {
  const sentMessageSignature = 'createRetryableTicket(address,uint256,uint256,address,address,uint256,uint256,bytes)'
  const decodedCalldata = await getDecodedCallData({
    chain: CometChains.arbitrum,
    target,
    signature,
    calldata,
    sentMessageSignature,
  })
  const parsedDataToBridge = decodedCalldata.at(7)
  return extractTransactionsFromBridgedData(parsedDataToBridge)
}

export async function getDecodedBytesForBase(
  target: string,
  signature: string,
  calldata: string,
): Promise<ExecuteTransactionsInfo> {
  const sentMessageSignature = 'sendMessage(address,bytes,uint32)'
  const decodedCalldata = await getDecodedCallData({
    chain: CometChains.mainnet,
    target,
    signature,
    calldata,
    sentMessageSignature,
  })
  const parsedDataToBridge = decodedCalldata.at(1)
  return extractTransactionsFromBridgedData(parsedDataToBridge)
}

async function getDecodedBytesForPolygon(
  target: string,
  signature: string,
  calldata: string,
): Promise<ExecuteTransactionsInfo> {
  const sentMessageSignature = 'sendMessageToChild(address,bytes)'
  const decodedCalldata = await getDecodedCallData({
    chain: CometChains.polygon,
    target,
    signature,
    calldata,
    sentMessageSignature,
  })
  const parsedDataToBridge = decodedCalldata.at(1)
  return extractTransactionsFromBridgedData(parsedDataToBridge)
}

function extractTransactionsFromBridgedData(parsedDataToBridge: any) {
  const abiCoder = new AbiCoder()
  const decoded = abiCoder.decode(['address[]', 'uint256[]', 'string[]', 'bytes[]'], parsedDataToBridge.toString())

  return {
    targets: (decoded.at(0) as string[]).map((target) => target.toLowerCase()),
    values: (decoded.at(1) as BigNumber[]).map((value) => value),
    signatures: (decoded.at(2) as string[]).map((signature) => signature),
    calldatas: (decoded.at(3) as string[]).map((calldata) => calldata),
  }
}
