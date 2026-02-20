/**
 * Simulation for ActivateL2sProposal: activate V3 protocol fees on Celo, Soneium,
 * Worldchain, XLayer, and Zora.
 *
 * Mirrors the 6 actions from the Solidity script. Replace placeholder addresses
 * (fee adapters, Celo CrossChainAccount, Celo TokenJar) with actual deployed
 * addresses before running against a real proposal.
 */
import { encodeFunctionData, getAddress, parseAbi } from 'viem';

import type { SimulationConfigNew } from '../types';

// ─── ABI fragments ───
const FORWARD_ABI = parseAbi(['function forward(address target, bytes data)']);
const SET_OWNER_ABI = parseAbi(['function setOwner(address _owner)']);
const EMPTY_SIG = '' as `0x${string}`;

// ─── Gas limits (match Solidity script) ───
const XDM_GAS_LIMIT = 200_000;
const DEPOSIT_GAS_LIMIT = 200_000n;

// ─── Soneium (owner = aliased Timelock → depositTransaction) ───
const SONEIUM_PORTAL = getAddress('0x88e529A6ccd302c948689Cd5156C83D4614FAE92');
const SONEIUM_V3_FACTORY = getAddress('0x42aE7Ec7ff020412639d443E245D936429Fbe717');

// ─── XLayer (owner = aliased Timelock → depositTransaction) ───
const XLAYER_PORTAL = getAddress('0x64057ad1DdAc804d0D26A7275b193D9DACa19993');
const XLAYER_V3_FACTORY = getAddress('0x4B2ab38DBF28D31D467aA8993f6c2585981D6804');

// ─── Celo (owner = CrossChainAccount after Wormhole handoff → XDM) ───
const CELO_L1_MESSENGER = getAddress('0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95');
const CELO_V3_FACTORY = getAddress('0xAfE208a311B21f13EF87E33A90049fC17A7acDEc');
const CELO_V2_FACTORY = getAddress('0x79a530c8e2fA8748B7B40dd3629C0520c2cCf03f');

// ─── Worldchain (owner = CrossChainAccount → XDM) ───
const WORLDCHAIN_L1_MESSENGER = getAddress('0xf931a81D18B1766d15695ffc7c1920a62b7e710a');
const WORLDCHAIN_CROSS_CHAIN_ACCOUNT = getAddress('0xcb2436774C3e191c85056d248EF4260ce5f27A9D');
const WORLDCHAIN_V3_FACTORY = getAddress('0x7a5028BDa40e7B173C278C5342087826455ea25a');

// ─── Zora (owner = CrossChainAccount → XDM) ───
const ZORA_L1_MESSENGER = getAddress('0xdC40a14d9abd6F410226f1E6de71aE03441ca506');
const ZORA_CROSS_CHAIN_ACCOUNT = getAddress('0x36eEC182D0B24Df3DC23115D64DB521A93D5154f');
const ZORA_V3_FACTORY = getAddress('0x7145F8aeef1f6510E92164038E1B6F8cB2c42Cbb');

// Placeholder addresses — replace with actual deployed addresses before real proposal run
const SONEIUM_FEE_ADAPTER = getAddress('0x1111111111111111111111111111111111111111');
const XLAYER_FEE_ADAPTER = getAddress('0x2222222222222222222222222222222222222222');
const CELO_CROSS_CHAIN_ACCOUNT = getAddress('0x3333333333333333333333333333333333333333');
const CELO_FEE_ADAPTER = getAddress('0x4444444444444444444444444444444444444444');
const CELO_TOKEN_JAR = getAddress('0x5555555555555555555555555555555555555555');
const WORLDCHAIN_FEE_ADAPTER = getAddress('0x6666666666666666666666666666666666666666');
const ZORA_FEE_ADAPTER = getAddress('0x7777777777777777777777777777777777777777');

const SEND_MESSAGE_ABI = parseAbi([
  'function sendMessage(address _target, bytes _message, uint32 _minGasLimit)',
]);
const OPTIMISM_PORTAL_ABI = parseAbi([
  'function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data)',
]);
const V2_FACTORY_ABI = parseAbi(['function setFeeTo(address)']);

// Action 0: Soneium — depositTransaction to transfer factory to fee adapter
const call0 = {
  target: SONEIUM_PORTAL,
  calldata: encodeFunctionData({
    abi: OPTIMISM_PORTAL_ABI,
    functionName: 'depositTransaction',
    args: [
      SONEIUM_V3_FACTORY,
      0n,
      DEPOSIT_GAS_LIMIT,
      false,
      encodeFunctionData({
        abi: SET_OWNER_ABI,
        functionName: 'setOwner',
        args: [SONEIUM_FEE_ADAPTER],
      }),
    ],
  }),
  value: 0n,
  signature: EMPTY_SIG,
};

// Action 1: XLayer — depositTransaction to transfer factory to fee adapter
const call1 = {
  target: XLAYER_PORTAL,
  calldata: encodeFunctionData({
    abi: OPTIMISM_PORTAL_ABI,
    functionName: 'depositTransaction',
    args: [
      XLAYER_V3_FACTORY,
      0n,
      DEPOSIT_GAS_LIMIT,
      false,
      encodeFunctionData({
        abi: SET_OWNER_ABI,
        functionName: 'setOwner',
        args: [XLAYER_FEE_ADAPTER],
      }),
    ],
  }),
  value: 0n,
  signature: EMPTY_SIG,
};

// Action 2: Celo — XDM to transfer V3 factory to fee adapter
const celoV3Forward = encodeFunctionData({
  abi: FORWARD_ABI,
  functionName: 'forward',
  args: [
    CELO_V3_FACTORY,
    encodeFunctionData({
      abi: SET_OWNER_ABI,
      functionName: 'setOwner',
      args: [CELO_FEE_ADAPTER],
    }),
  ],
});
const call2 = {
  target: CELO_L1_MESSENGER,
  calldata: encodeFunctionData({
    abi: SEND_MESSAGE_ABI,
    functionName: 'sendMessage',
    args: [CELO_CROSS_CHAIN_ACCOUNT, celoV3Forward, XDM_GAS_LIMIT],
  }),
  value: 0n,
  signature: EMPTY_SIG,
};

// Action 3: Celo — set V2 factory feeTo to TokenJar
const celoV2Forward = encodeFunctionData({
  abi: FORWARD_ABI,
  functionName: 'forward',
  args: [
    CELO_V2_FACTORY,
    encodeFunctionData({
      abi: V2_FACTORY_ABI,
      functionName: 'setFeeTo',
      args: [CELO_TOKEN_JAR],
    }),
  ],
});
const call3 = {
  target: CELO_L1_MESSENGER,
  calldata: encodeFunctionData({
    abi: SEND_MESSAGE_ABI,
    functionName: 'sendMessage',
    args: [CELO_CROSS_CHAIN_ACCOUNT, celoV2Forward, XDM_GAS_LIMIT],
  }),
  value: 0n,
  signature: EMPTY_SIG,
};

// Action 4: Worldchain — XDM to transfer factory to fee adapter
const worldchainForward = encodeFunctionData({
  abi: FORWARD_ABI,
  functionName: 'forward',
  args: [
    WORLDCHAIN_V3_FACTORY,
    encodeFunctionData({
      abi: SET_OWNER_ABI,
      functionName: 'setOwner',
      args: [WORLDCHAIN_FEE_ADAPTER],
    }),
  ],
});
const call4 = {
  target: WORLDCHAIN_L1_MESSENGER,
  calldata: encodeFunctionData({
    abi: SEND_MESSAGE_ABI,
    functionName: 'sendMessage',
    args: [WORLDCHAIN_CROSS_CHAIN_ACCOUNT, worldchainForward, XDM_GAS_LIMIT],
  }),
  value: 0n,
  signature: EMPTY_SIG,
};

// Action 5: Zora — XDM to transfer factory to fee adapter
const zoraForward = encodeFunctionData({
  abi: FORWARD_ABI,
  functionName: 'forward',
  args: [
    ZORA_V3_FACTORY,
    encodeFunctionData({
      abi: SET_OWNER_ABI,
      functionName: 'setOwner',
      args: [ZORA_FEE_ADAPTER],
    }),
  ],
});
const call5 = {
  target: ZORA_L1_MESSENGER,
  calldata: encodeFunctionData({
    abi: SEND_MESSAGE_ABI,
    functionName: 'sendMessage',
    args: [ZORA_CROSS_CHAIN_ACCOUNT, zoraForward, XDM_GAS_LIMIT],
  }),
  value: 0n,
  signature: EMPTY_SIG,
};

const calls = [call0, call1, call2, call3, call4, call5];

export const config: SimulationConfigNew = {
  type: 'new',
  daoName: 'Uniswap',
  governorAddress: getAddress('0x408ED6354d4973f66138C91495F2f2FCbd8724C3'),
  governorType: 'bravo',
  targets: calls.map((c) => c.target),
  values: calls.map((c) => c.value),
  signatures: calls.map((c) => c.signature),
  calldatas: calls.map((c) => c.calldata),
  description: `# Activate V3 Protocol Fees on Celo, Soneium, Worldchain, XLayer, and Zora

This simulation runs the 6 actions from ActivateL2sProposal:

**Phase 1 — Unify ownership (depositTransaction):**
1. **Soneium** — OptimismPortal.depositTransaction → V3Factory.setOwner(SONEIUM_FEE_ADAPTER)
2. **XLayer** — OptimismPortal.depositTransaction → V3Factory.setOwner(XLAYER_FEE_ADAPTER)

**Phase 2 — Activate via XDM:**
3. **Celo** — L1CrossDomainMessenger → CrossChainAccount.forward(V3Factory, setOwner(CELO_FEE_ADAPTER))
4. **Celo** — L1CrossDomainMessenger → CrossChainAccount.forward(V2Factory, setFeeTo(CELO_TOKEN_JAR))
5. **Worldchain** — L1CrossDomainMessenger → CrossChainAccount.forward(V3Factory, setOwner(WORLDCHAIN_FEE_ADAPTER))
6. **Zora** — L1CrossDomainMessenger → CrossChainAccount.forward(V3Factory, setOwner(ZORA_FEE_ADAPTER))

Placeholder addresses are used for fee adapters, Celo CrossChainAccount, and Celo TokenJar; replace with deployed addresses for production.`,
};
