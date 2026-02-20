/**
 * Simulation for ActivateOPBaseArbProposal: activate protocol fees on OP Mainnet,
 * Base, Arbitrum, and Ethereum mainnet, plus Celo governance handoff.
 *
 * Mirrors the 8 actions from the Solidity script. Replace placeholder addresses
 * (OP_FEE_ADAPTER, OP_TOKEN_JAR, etc.) with actual deployed addresses before
 * running against a real proposal or when deployments are available.
 */
import { encodeFunctionData, getAddress, parseAbi, parseEther, parseGwei } from 'viem';

import type { SimulationConfigNew } from '../types';
import ArbitrumDelayedInboxAbi from '../utils/abis/ArbitrumDelayedInboxAbi.json' assert {
  type: 'json',
};
import L2CrossChainAccount from '../utils/abis/L2CrossChainAccount.json' assert { type: 'json' };
import v3FactoryAbi from '../utils/abis/v3FactoryAbi.json' assert { type: 'json' };

// ─── Gas limits (match Solidity script) ───
const XDM_GAS_LIMIT = 200_000;
const ARB_GAS_LIMIT = 200_000n;
const ARB_MAX_FEE_PER_GAS = parseGwei('0.1');
const ARB_MAX_SUBMISSION_COST = parseEther('0.01');
const ARB_VALUE = ARB_MAX_SUBMISSION_COST + ARB_GAS_LIMIT * ARB_MAX_FEE_PER_GAS;

// ─── OP Mainnet ───
const OP_L1_MESSENGER = getAddress('0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1');
const OP_CROSS_CHAIN_ACCOUNT = getAddress('0xa1dD330d602c32622AA270Ea73d078B803Cb3518');
const OP_V3_FACTORY = getAddress('0x1F98431c8aD98523631AE4a59f267346ea31F984');
const OP_V2_FACTORY = getAddress('0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf');

// ─── Base ───
const BASE_L1_MESSENGER = getAddress('0x866E82a600A1414e583f7F13623F1aC5d58b0Afa');
const BASE_CROSS_CHAIN_ACCOUNT = getAddress('0x31FAfd4889FA1269F7a13A66eE0fB458f27D72A9');
const BASE_V3_FACTORY = getAddress('0x33128a8fC17869897dcE68Ed026d694621f6FDfD');
const BASE_V2_FACTORY = getAddress('0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6');

// ─── Arbitrum ───
const ARB_INBOX = getAddress('0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f');
const ARB_V3_FACTORY = getAddress('0x1F98431c8aD98523631AE4a59f267346ea31F984');
const ARB_ALIASED_TIMELOCK = getAddress('0x2BAD8182C09F50c8318d769245beA52C32Be46CD');
const ARB_V2_FACTORY = getAddress('0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9');

// ─── Mainnet V3 migration ───
// ─── Celo Wormhole ───
const WORMHOLE_SENDER = getAddress('0xf5F4496219F31CDCBa6130B5402873624585615a');
const WORMHOLE_BRIDGE = getAddress('0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B');
const WORMHOLE_CELO_CHAIN_ID = 14;
const CELO_V3_FACTORY = getAddress('0xAfE208a311B21f13EF87E33A90049fC17A7acDEc');
const CELO_V2_FACTORY = getAddress('0x79a530c8e2fA8748B7B40dd3629C0520c2cCf03f');
const CELO_V4_POOL_MANAGER = getAddress('0x288dc841A52FCA2707c6947B3A777c5E56cd87BC');

// Placeholder addresses — replace with actual deployed addresses before real proposal run
const OP_FEE_ADAPTER = getAddress('0x1111111111111111111111111111111111111111');
const OP_TOKEN_JAR = getAddress('0x2222222222222222222222222222222222222222');
const BASE_FEE_ADAPTER = getAddress('0x3333333333333333333333333333333333333333');
const BASE_TOKEN_JAR = getAddress('0x4444444444444444444444444444444444444444');
const ARB_FEE_ADAPTER = getAddress('0x5555555555555555555555555555555555555555');
const ARB_TOKEN_JAR = getAddress('0x6666666666666666666666666666666666666666');
const MAINNET_V3_FEE_ADAPTER = getAddress('0x7777777777777777777777777777777777777777');
const MAINNET_V3_OPEN_FEE_ADAPTER = getAddress('0x8888888888888888888888888888888888888888');
const CELO_CROSS_CHAIN_ACCOUNT = getAddress('0x9999999999999999999999999999999999999999');

const SEND_MESSAGE_ABI = parseAbi([
  'function sendMessage(address _target, bytes _message, uint32 _minGasLimit)',
]);
const V2_FACTORY_ABI = parseAbi(['function setFeeTo(address)', 'function setFeeToSetter(address)']);
const V3_FEE_ADAPTER_ABI = parseAbi(['function setFactoryOwner(address newOwner)']);
const OWNED_ABI = parseAbi(['function transferOwnership(address newOwner)']);
const WORMHOLE_SENDER_ABI = parseAbi([
  'function sendMessage(address[] targets, uint256[] values, bytes[] datas, address wormhole, uint16 chainId)',
]);

// Action 0: OP Mainnet V3 factory → V3OpenFeeAdapter (XDM → CrossChainAccount.forward)
const opV3Forward = encodeFunctionData({
  abi: L2CrossChainAccount as unknown as readonly unknown[],
  functionName: 'forward',
  args: [
    OP_V3_FACTORY,
    encodeFunctionData({
      abi: v3FactoryAbi as unknown as readonly unknown[],
      functionName: 'setOwner',
      args: [OP_FEE_ADAPTER],
    }),
  ],
});
const call0 = {
  target: OP_L1_MESSENGER,
  calldata: encodeFunctionData({
    abi: SEND_MESSAGE_ABI,
    functionName: 'sendMessage',
    args: [OP_CROSS_CHAIN_ACCOUNT, opV3Forward, XDM_GAS_LIMIT],
  }),
  value: 0n,
  signature: '',
};

// Action 1: Base V3 factory → V3OpenFeeAdapter
const baseV3Forward = encodeFunctionData({
  abi: L2CrossChainAccount as unknown as readonly unknown[],
  functionName: 'forward',
  args: [
    BASE_V3_FACTORY,
    encodeFunctionData({
      abi: v3FactoryAbi as unknown as readonly unknown[],
      functionName: 'setOwner',
      args: [BASE_FEE_ADAPTER],
    }),
  ],
});
const call1 = {
  target: BASE_L1_MESSENGER,
  calldata: encodeFunctionData({
    abi: SEND_MESSAGE_ABI,
    functionName: 'sendMessage',
    args: [BASE_CROSS_CHAIN_ACCOUNT, baseV3Forward, XDM_GAS_LIMIT],
  }),
  value: 0n,
  signature: '',
};

// Action 2: Arbitrum V3 factory → V3OpenFeeAdapter (retryable ticket)
const call2 = {
  target: ARB_INBOX,
  calldata: encodeFunctionData({
    abi: ArbitrumDelayedInboxAbi as unknown as readonly unknown[],
    functionName: 'createRetryableTicket',
    args: [
      ARB_V3_FACTORY,
      0n,
      ARB_MAX_SUBMISSION_COST,
      ARB_ALIASED_TIMELOCK,
      ARB_ALIASED_TIMELOCK,
      ARB_GAS_LIMIT,
      ARB_MAX_FEE_PER_GAS,
      encodeFunctionData({
        abi: v3FactoryAbi as unknown as readonly unknown[],
        functionName: 'setOwner',
        args: [ARB_FEE_ADAPTER],
      }),
    ],
  }),
  value: ARB_VALUE,
  signature: '',
};

// Action 3: Mainnet V3FeeAdapter → V3OpenFeeAdapter
const call3 = {
  target: MAINNET_V3_FEE_ADAPTER,
  calldata: encodeFunctionData({
    abi: V3_FEE_ADAPTER_ABI,
    functionName: 'setFactoryOwner',
    args: [MAINNET_V3_OPEN_FEE_ADAPTER],
  }),
  value: 0n,
  signature: '',
};

// Action 4: OP Mainnet V2 factory feeTo → TokenJar
const opV2Forward = encodeFunctionData({
  abi: L2CrossChainAccount as unknown as readonly unknown[],
  functionName: 'forward',
  args: [
    OP_V2_FACTORY,
    encodeFunctionData({
      abi: V2_FACTORY_ABI,
      functionName: 'setFeeTo',
      args: [OP_TOKEN_JAR],
    }),
  ],
});
const call4 = {
  target: OP_L1_MESSENGER,
  calldata: encodeFunctionData({
    abi: SEND_MESSAGE_ABI,
    functionName: 'sendMessage',
    args: [OP_CROSS_CHAIN_ACCOUNT, opV2Forward, XDM_GAS_LIMIT],
  }),
  value: 0n,
  signature: '',
};

// Action 5: Base V2 factory feeTo → TokenJar
const baseV2Forward = encodeFunctionData({
  abi: L2CrossChainAccount as unknown as readonly unknown[],
  functionName: 'forward',
  args: [
    BASE_V2_FACTORY,
    encodeFunctionData({
      abi: V2_FACTORY_ABI,
      functionName: 'setFeeTo',
      args: [BASE_TOKEN_JAR],
    }),
  ],
});
const call5 = {
  target: BASE_L1_MESSENGER,
  calldata: encodeFunctionData({
    abi: SEND_MESSAGE_ABI,
    functionName: 'sendMessage',
    args: [BASE_CROSS_CHAIN_ACCOUNT, baseV2Forward, XDM_GAS_LIMIT],
  }),
  value: 0n,
  signature: '',
};

// Action 6: Arbitrum V2 factory feeTo → TokenJar (retryable ticket)
const call6 = {
  target: ARB_INBOX,
  calldata: encodeFunctionData({
    abi: ArbitrumDelayedInboxAbi as unknown as readonly unknown[],
    functionName: 'createRetryableTicket',
    args: [
      ARB_V2_FACTORY,
      0n,
      ARB_MAX_SUBMISSION_COST,
      ARB_ALIASED_TIMELOCK,
      ARB_ALIASED_TIMELOCK,
      ARB_GAS_LIMIT,
      ARB_MAX_FEE_PER_GAS,
      encodeFunctionData({
        abi: V2_FACTORY_ABI,
        functionName: 'setFeeTo',
        args: [ARB_TOKEN_JAR],
      }),
    ],
  }),
  value: ARB_VALUE,
  signature: '',
};

// Action 7: Celo Wormhole handoff — V3 setOwner, V2 setFeeToSetter, V4 PoolManager transferOwnership
const celoTargets = [CELO_V3_FACTORY, CELO_V2_FACTORY, CELO_V4_POOL_MANAGER] as const;
const celoValues = [0n, 0n, 0n] as const;
const celoDatas = [
  encodeFunctionData({
    abi: v3FactoryAbi as unknown as readonly unknown[],
    functionName: 'setOwner',
    args: [CELO_CROSS_CHAIN_ACCOUNT],
  }),
  encodeFunctionData({
    abi: V2_FACTORY_ABI,
    functionName: 'setFeeToSetter',
    args: [CELO_CROSS_CHAIN_ACCOUNT],
  }),
  encodeFunctionData({
    abi: OWNED_ABI,
    functionName: 'transferOwnership',
    args: [CELO_CROSS_CHAIN_ACCOUNT],
  }),
] as const;
const call7 = {
  target: WORMHOLE_SENDER,
  calldata: encodeFunctionData({
    abi: WORMHOLE_SENDER_ABI,
    functionName: 'sendMessage',
    args: [
      [...celoTargets],
      [...celoValues],
      [...celoDatas],
      WORMHOLE_BRIDGE,
      WORMHOLE_CELO_CHAIN_ID,
    ],
  }),
  value: 0n,
  signature: '',
};

const calls = [call0, call1, call2, call3, call4, call5, call6, call7];

export const config: SimulationConfigNew = {
  type: 'new',
  daoName: 'Uniswap',
  governorAddress: getAddress('0x408ED6354d4973f66138C91495F2f2FCbd8724C3'),
  governorType: 'bravo',
  targets: calls.map((c) => c.target),
  values: calls.map((c) => c.value),
  signatures: calls.map((c) => c.signature as `0x${string}`),
  calldatas: calls.map((c) => c.calldata),
  description: `# Activate Protocol Fees on OP Mainnet, Base, Arbitrum, and Ethereum + Celo Governance Handoff

This simulation runs the 8 actions from ActivateOPBaseArbProposal:

1. **OP Mainnet** — L1CrossDomainMessenger → CrossChainAccount.forward(V3Factory, setOwner(OP_FEE_ADAPTER))
2. **Base** — L1CrossDomainMessenger → CrossChainAccount.forward(V3Factory, setOwner(BASE_FEE_ADAPTER))
3. **Arbitrum** — Inbox.createRetryableTicket → V3Factory.setOwner(ARB_FEE_ADAPTER)
4. **Mainnet** — V3FeeAdapter.setFactoryOwner(MAINNET_V3_OPEN_FEE_ADAPTER)
5. **OP Mainnet** — XDM → CrossChainAccount.forward(V2Factory, setFeeTo(OP_TOKEN_JAR))
6. **Base** — XDM → CrossChainAccount.forward(V2Factory, setFeeTo(BASE_TOKEN_JAR))
7. **Arbitrum** — Inbox.createRetryableTicket → V2Factory.setFeeTo(ARB_TOKEN_JAR)
8. **Celo** — WormholeSender.sendMessage → V3 setOwner + V2 setFeeToSetter + V4 PoolManager transferOwnership to CELO_CROSS_CHAIN_ACCOUNT

Placeholder addresses are used for fee adapters, token jars, and Celo CrossChainAccount; replace with deployed addresses for production.`,
};
