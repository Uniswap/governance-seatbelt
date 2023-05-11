## OptimismBridgeExecutor actionSet("15": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [17237043](https://etherscan.io/block/17237043) at 5/11/2023, 8:14:23 AM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/4d8e7c1a-18ec-4a2d-86ca-c6570ac3dd79](https://dashboard.tenderly.co/me/simulator/4d8e7c1a-18ec-4a2d-86ca-c6570ac3dd79)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x764594F8e9757edE877B75716f8077162B251460`
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003b` @@
- "0x00000000000000000000000000000000000000000000000b00000000000009c4"
+ "0x00000000000000000000000000000000000000000000000c00000000000009c4"
@@ Slot `0x1d70cb806c8648a5cff3f5c8e2359f0ed5c6c17466a16848db13e82a035534b2` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000b532b800000000000003e800073f7800002625a007d0051229041f401d4c"
@@ Slot `0x1d70cb806c8648a5cff3f5c8e2359f0ed5c6c17466a16848db13e82a035534b3` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000033b2e3c9fd0803ce8000000"
@@ Slot `0x1d70cb806c8648a5cff3f5c8e2359f0ed5c6c17466a16848db13e82a035534b4` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000033b2e3c9fd0803ce8000000"
@@ Slot `0x1d70cb806c8648a5cff3f5c8e2359f0ed5c6c17466a16848db13e82a035534b5` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000b000000000000000000000000000000000000000000"
@@ Slot `0x1d70cb806c8648a5cff3f5c8e2359f0ed5c6c17466a16848db13e82a035534b6` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000008ffdf2de812095b1d19cb146e4c004587c0a0692"
@@ Slot `0x1d70cb806c8648a5cff3f5c8e2359f0ed5c6c17466a16848db13e82a035534b7` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000a5e408678469d23efdb7694b1b0a85bb0669e8bd"
@@ Slot `0x1d70cb806c8648a5cff3f5c8e2359f0ed5c6c17466a16848db13e82a035534b8` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000a8669021776bc142dfca87c21b4a52595bcbb40a"
@@ Slot `0x1d70cb806c8648a5cff3f5c8e2359f0ed5c6c17466a16848db13e82a035534b9` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000d624afa34614b4fe7fee7e1751a2e5e04fb47398"
@@ Slot `0xf801cd91f4737d4fcbeb3108ca2da80cf9c1a7a3469221f74308d5bc7ba7610b` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000dfa46478f9e5ea86d57387849598dbfb2e964b02"
```

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_queuedActions` key `0x80225f6ff2500fb114f35b6d8db3220caea14cf48e854ac36993a652bd84c83f` @@
- true
+ false

@@ `_actionsSets` key `"15"`.executed @@
- false
+ true

```

```diff
# unknown contract name at `0x8ffDf2DE812095b1D19CB146E4c004587C0A0692`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000000` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000001"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000037` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x41617665204f7074696d69736d204d4149000000000000000000000000000022"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000038` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x614f70744d41490000000000000000000000000000000000000000000000000e"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000039` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000929ec64c34a17401f460460d4b9390518e5b473e12"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003b` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0xcfb52330e28ac1e8efa25cc93dcf69e12125be89c462dc3fc42748b82a261370"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003c` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000b2289e329d2f85f1ed31adbb30ea345278f21bcf"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000dfa46478f9e5ea86d57387849598dbfb2e964b02"
@@ Slot `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000a5ba6e5ec19a1bf23c857991c857db62b2aa187b"
```

```diff
# unknown contract name at `0xa5e408678469d23efDB7694b1B0A85BB0669e8bd`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000000` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000001"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000035` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0xadcfca09862ae5fe38637adf9c59ddeaf0f479ef758684e16c49aca45dbfaa97"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000037` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000dfa46478f9e5ea86d57387849598dbfb2e964b02"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003b` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x41617665204f7074696d69736d20537461626c652044656274204d414900003a"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003c` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x737461626c65446562744f70744d414900000000000000000000000000000020"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000929ec64c34a17401f460460d4b9390518e5b473e12"
@@ Slot `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x00000000000000000000000052a1ceb68ee6b7b5d13e0376a1e0e4423a8ce26e"
```

```diff
# unknown contract name at `0xA8669021776Bc142DfcA87c21b4A52595bCbB40a`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000000` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000001"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000035` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0xad166de77cd1d683ad0435d7d37b44b49f290278c5cd56a8ad91a552c7755a72"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000037` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000dfa46478f9e5ea86d57387849598dbfb2e964b02"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003b` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x41617665204f7074696d69736d205661726961626c652044656274204d41493e"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003c` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x7661726961626c65446562744f70744d41490000000000000000000000000024"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000929ec64c34a17401f460460d4b9390518e5b473e12"
@@ Slot `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x00000000000000000000000081387c40eb75acb02757c1ae55d5936e78c9ded3"
```

```diff
# AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`
@@ `assetsSources` key `0xdfa46478f9e5ea86d57387849598dbfb2e964b02` @@
- 0x0000000000000000000000000000000000000000
+ 0x73a3919a69efcd5b19df8348c6740bb1446f5ed0

```

```diff
# unknown contract name at `0xDd81E6F85358292075B78fc8D5830BE8434aF8BA`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000002` @@
- "0x0000000000000000000000000000000000000000000000000000000000000006"
+ "0x0000000000000000000000000000000000000000000000000000000000000007"
@@ Slot `0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad4` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000d624afa34614b4fe7fee7e1751a2e5e04fb47398"
@@ Slot `0x6ec3d5434679d2a34237258b27165aa6de53b386e0080626eef298ba6918f884` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000d624afa34614b4fe7fee7e1751a2e5e04fb47398"
```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`
    - `AssetSourceUpdated(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, source: 0x73a3919a69efcd5b19df8348c6740bb1446f5ed0)`
  - unknown contract name at `0xDd81E6F85358292075B78fc8D5830BE8434aF8BA`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0xdd81e6f85358292075b78fc8d5830be8434af8ba","topics":["0x3378eea2a54404744f94089100239b7164fca47ac2da529398895f830297b5ed","0x000000000000000000000000d624afa34614b4fe7fee7e1751a2e5e04fb47398","0xddc96718b3f1e727d746bb82de6be2b8c699de39b24542b8574ae9b4e3e70470"],"data":"0x00000000000000000000000000000000000000000295be96e640669720000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000021165458500521280000000000000000000000000000000000000000000000026c62ad77dc602dae00000000000000000000000000000000000000000000000021165458500521280000000000000000000000000000000000000000000000026c62ad77dc602dae000000000000000000000000000000000000000000000000084595161401484a000000000000000000000000000000000000000000000000422ca8b0a00a4250000000000000000000000000000000000000000000000000a56fa5b99019a5c8000000"}}`
  - unknown contract name at `0x8ffDf2DE812095b1D19CB146E4c004587C0A0692`
    - `Initialized(underlyingAsset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, pool: 0x794a61358d6845594f94dc1db02a252b5b4814ad, treasury: 0xb2289e329d2f85f1ed31adbb30ea345278f21bcf, incentivesController: 0x929ec64c34a17401f460460d4b9390518e5b473e, aTokenDecimals: 18, aTokenName: Aave Optimism MAI, aTokenSymbol: aOptMAI, params: 0x)`
  - unknown contract name at `0xa5e408678469d23efDB7694b1B0A85BB0669e8bd`
    - `Initialized(underlyingAsset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, pool: 0x794a61358d6845594f94dc1db02a252b5b4814ad, incentivesController: 0x929ec64c34a17401f460460d4b9390518e5b473e, debtTokenDecimals: 18, debtTokenName: Aave Optimism Stable Debt MAI, debtTokenSymbol: stableDebtOptMAI, params: 0x)`
  - unknown contract name at `0xA8669021776Bc142DfcA87c21b4A52595bCbB40a`
    - `Initialized(underlyingAsset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, pool: 0x794a61358d6845594f94dc1db02a252b5b4814ad, incentivesController: 0x929ec64c34a17401f460460d4b9390518e5b473e, debtTokenDecimals: 18, debtTokenName: Aave Optimism Variable Debt MAI, debtTokenSymbol: variableDebtOptMAI, params: 0x)`
  - InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation PoolConfigurator at `0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B`
    - `ReserveInitialized(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, aToken: 0x8ffdf2de812095b1d19cb146e4c004587c0a0692, stableDebtToken: 0xa5e408678469d23efdb7694b1b0a85bb0669e8bd, variableDebtToken: 0xa8669021776bc142dfca87c21b4a52595bcbb40a, interestRateStrategyAddress: 0xd624afa34614b4fe7fee7e1751a2e5e04fb47398)`
    - `SupplyCapChanged(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, oldSupplyCap: 0, newSupplyCap: 7600000)`
    - `BorrowCapChanged(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, oldBorrowCap: 0, newBorrowCap: 2500000)`
    - `ReserveBorrowing(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, enabled: true)`
    - `ReserveStableRateBorrowing(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, enabled: false)`
    - `BorrowableInIsolationChanged(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, borrowable: false)`
    - `SiloedBorrowingChanged(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, oldState: false, newState: false)`
    - `ReserveFactorChanged(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, oldReserveFactor: 0, newReserveFactor: 2000)`
    - `CollateralConfigurationChanged(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, ltv: 7500, liquidationThreshold: 8000, liquidationBonus: 10500)`
    - `LiquidationProtocolFeeChanged(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, oldFee: 0, newFee: 1000)`
    - `DebtCeilingChanged(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, oldDebtCeiling: 0, newDebtCeiling: 190000000)`
    - `EModeAssetCategoryChanged(asset: 0xdfa46478f9e5ea86d57387849598dbfb2e964b02, oldCategoryId: 0, newCategoryId: 0)`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 15, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0x1720d605289A189c5fbD360Ca2307DB5C6D3fDfd: Contract (not verified)
  - 0x7A9A9c14B35E58ffa1cC84aB421acE0FdcD289E3: Contract (not verified)
  - 0x73A3919a69eFCd5b19df8348c6740bB1446F5ed0: Contract (not verified)
  - 0x1C1245eEfB57d50F90EFc4070b508f4f24c3aB7A: Contract (not verified)
  - 0xD81eb3728a631871a7eBBaD631b5f424909f0c77: Contract (verified) (AaveOracle)
  - 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb: Contract (verified) (PoolAddressesProvider)
  - 0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B: Contract (verified) (ACLManager)
  - 0xDd81E6F85358292075B78fc8D5830BE8434aF8BA: Contract (not verified)
  - 0x85FB6dff5F59695d77cc61898e60D040165b1923: Contract (not verified)
  - 0xD624AFA34614B4fe7FEe7e1751a2E5E04fb47398: EOA (verification not applicable)
  - 0xdFA46478F9e5EA86d57387849598dbFB2e964b02: Contract (verified) (EditableERC20)
  - 0x8145eddDf43f50276641b55bd3AD95944510021E: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B: Contract (verified) (PoolConfigurator)
  - 0x7406aba1Aa5fE5cd71d958CE10fc28c416a33aA0: Contract (verified) (ConfiguratorLogic)
  - 0x8ffDf2DE812095b1D19CB146E4c004587C0A0692: Contract (not verified)
  - 0xa5ba6E5EC19a1Bf23C857991c857dB62b2Aa187B: Contract (verified) (AToken)
  - 0xa5e408678469d23efDB7694b1B0A85BB0669e8bd: Contract (not verified)
  - 0x52A1CeB68Ee6b7B5D13E0376A1E0E4423A8cE26e: Contract (verified) (StableDebtToken)
  - 0xA8669021776Bc142DfcA87c21b4A52595bCbB40a: Contract (not verified)
  - 0x81387c40EB75acB02757C1Ae55D5936E78c9dEd3: Contract (verified) (VariableDebtToken)
  - 0x794a61358D6845594F94dc1DB02A252b5b4814aD: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0x764594F8e9757edE877B75716f8077162B251460: Contract (verified) (L2Pool)
  - 0xD5256981e08492AFc543aF2a779Af989E9f9F7e7: Contract (not verified)
  - 0xd9Ca4878dd38B021583c1B669905592EAe76E044: Contract (verified) (AaveProtocolDataProvider)

#### Runs solc against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>
<details>
<summary>View warnings for PoolConfigurator at `0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for StableDebtToken (STABLE_DEBT_TOKEN_IMPL) at `0x52A1CeB68Ee6b7B5D13E0376A1E0E4423A8cE26e`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for ConfiguratorLogic at `0x7406aba1Aa5fE5cd71d958CE10fc28c416a33aA0`</summary>

```
WARNING:CryticCompile:Warning: Warning: This declaration has the same name as another declaration.
  --> lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol:23:15:
   |
23 |   constructor(address admin) {
   |               ^^^^^^^^^^^^^
Note: The other declaration is here:
  --> lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol:39:3:
   |
39 |   function admin() external ifAdmin returns (address) {
   |   ^ (Relevant source part starts here and spans across multiple lines).


Warning: Warning: This contract has a payable fallback function, but no receive ether function. Consider adding a receive ether function.
  --> lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol:11:1:
   |
11 | contract InitializableUpgradeabilityProxy is BaseUpgradeabilityProxy {
   | ^ (Relevant source part starts here and spans across multiple lines).
Note: The payable fallback function is defined here.
  --> lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/Proxy.sol:17:3:
   |
17 |   fallback() external payable {
   |   ^ (Relevant source part starts here and spans across multiple lines).


Warning: Warning: This contract has a payable fallback function, but no receive ether function. Consider adding a receive ether function.
  --> lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol:16:1:
   |
16 | contract BaseImmutableAdminUpgradeabilityProxy is BaseUpgradeabilityProxy {
   | ^ (Relevant source part starts here and spans across multiple lines).
Note: The payable fallback function is defined here.
  --> lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/Proxy.sol:17:3:
   |
17 |   fallback() external payable {
   |   ^ (Relevant source part starts here and spans across multiple lines).


Warning: Warning: This contract has a payable fallback function, but no receive ether function. Consider adding a receive ether function.
  --> lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol:13:1:
   |
13 | contract InitializableImmutableAdminUpgradeabilityProxy is
   | ^ (Relevant source part starts here and spans across multiple lines).
Note: The payable fallback function is defined here.
  --> lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/Proxy.sol:17:3:
   |
17 |   fallback() external payable {
   |   ^ (Relevant source part starts here and spans across multiple lines).



```

</details>

<details>
<summary>View warnings for L2Pool at `0x764594F8e9757edE877B75716f8077162B251460`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x764594F8e9757edE877B75716f8077162B251460`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for VariableDebtToken (VARIABLE_DEBT_TOKEN_IMPL) at `0x81387c40EB75acB02757C1Ae55D5936E78c9dEd3`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation PoolConfigurator at `0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for AToken (ATOKEN_IMPL) at `0xa5ba6E5EC19a1Bf23C857991c857dB62b2Aa187B`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for PoolAddressesProvider at `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for AaveProtocolDataProvider at `0xd9Ca4878dd38B021583c1B669905592EAe76E044`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for EditableERC20 (Mai Stablecoin) at `0xdFA46478F9e5EA86d57387849598dbFB2e964b02`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

</details>

#### Runs slither against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>

<details>
<summary>Slither report for PoolConfigurator at `0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for StableDebtToken (STABLE_DEBT_TOKEN_IMPL) at `0x52A1CeB68Ee6b7B5D13E0376A1E0E4423A8cE26e`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0x52A1CeB68Ee6b7B5D13E0376A1E0E4423A8cE26e
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for ConfiguratorLogic at `0x7406aba1Aa5fE5cd71d958CE10fc28c416a33aA0`</summary>

```
Warning: Warning: This declaration has the same name as another declaration.
  --> lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol:23:15:
   |
23 |   constructor(address admin) {
   |               ^^^^^^^^^^^^^
Note: The other declaration is here:
  --> lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol:39:3:
   |
39 |   function admin() external ifAdmin returns (address) {
   |   ^ (Relevant source part starts here and spans across multiple lines).


Warning: Warning: This contract has a payable fallback function, but no receive ether function. Consider adding a receive ether function.
  --> lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol:11:1:
   |
11 | contract InitializableUpgradeabilityProxy is BaseUpgradeabilityProxy {
   | ^ (Relevant source part starts here and spans across multiple lines).
Note: The payable fallback function is defined here.
  --> lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/Proxy.sol:17:3:
   |
17 |   fallback() external payable {
   |   ^ (Relevant source part starts here and spans across multiple lines).


Warning: Warning: This contract has a payable fallback function, but no receive ether function. Consider adding a receive ether function.
  --> lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol:16:1:
   |
16 | contract BaseImmutableAdminUpgradeabilityProxy is BaseUpgradeabilityProxy {
   | ^ (Relevant source part starts here and spans across multiple lines).
Note: The payable fallback function is defined here.
  --> lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/Proxy.sol:17:3:
   |
17 |   fallback() external payable {
   |   ^ (Relevant source part starts here and spans across multiple lines).


Warning: Warning: This contract has a payable fallback function, but no receive ether function. Consider adding a receive ether function.
  --> lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol:13:1:
   |
13 | contract InitializableImmutableAdminUpgradeabilityProxy is
   | ^ (Relevant source part starts here and spans across multiple lines).
Note: The payable fallback function is defined here.
  --> lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/Proxy.sol:17:3:
   |
17 |   fallback() external payable {
   |   ^ (Relevant source part starts here and spans across multiple lines).



INFO:Detectors:
InitializableUpgradeabilityProxy.initialize(address,bytes) (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol#20-28) uses delegatecall to a input-controlled function id
	- (success) = _logic.delegatecall(_data) (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol#25)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#controlled-delegatecall
INFO:Detectors:
BaseImmutableAdminUpgradeabilityProxy.constructor(address).admin (lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol#23) shadows:
	- BaseImmutableAdminUpgradeabilityProxy.admin() (lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol#39-41) (function)
InitializableImmutableAdminUpgradeabilityProxy.constructor(address).admin (lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol#21) shadows:
	- BaseImmutableAdminUpgradeabilityProxy.admin() (lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol#39-41) (function)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#local-variable-shadowing
INFO:Detectors:
InitializableUpgradeabilityProxy.initialize(address,bytes)._logic (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol#20) lacks a zero-check on :
		- (success) = _logic.delegatecall(_data) (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol#25)
BaseImmutableAdminUpgradeabilityProxy.upgradeToAndCall(address,bytes).newImplementation (lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol#70) lacks a zero-check on :
		- (success) = newImplementation.delegatecall(data) (lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol#74)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation
INFO:Detectors:
Modifier BaseImmutableAdminUpgradeabilityProxy.ifAdmin() (lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol#27-33) does not always execute _; or revertReference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-modifier
INFO:Detectors:
Reentrancy in ConfiguratorLogic.executeInitReserve(IPool,ConfiguratorInputTypes.InitReserveInput) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#50-122):
	External calls:
	- aTokenProxyAddress = _initTokenWithProxy(input.aTokenImpl,abi.encodeWithSelector(IInitializableAToken.initialize.selector,pool,input.treasury,input.underlyingAsset,input.incentivesController,input.underlyingAssetDecimals,input.aTokenName,input.aTokenSymbol,input.params)) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#54-67)
		- proxy.initialize(implementation,initParams) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#245)
	- stableDebtTokenProxyAddress = _initTokenWithProxy(input.stableDebtTokenImpl,abi.encodeWithSelector(IInitializableDebtToken.initialize.selector,pool,input.underlyingAsset,input.incentivesController,input.underlyingAssetDecimals,input.stableDebtTokenName,input.stableDebtTokenSymbol,input.params)) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#69-81)
		- proxy.initialize(implementation,initParams) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#245)
	- variableDebtTokenProxyAddress = _initTokenWithProxy(input.variableDebtTokenImpl,abi.encodeWithSelector(IInitializableDebtToken.initialize.selector,pool,input.underlyingAsset,input.incentivesController,input.underlyingAssetDecimals,input.variableDebtTokenName,input.variableDebtTokenSymbol,input.params)) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#83-95)
		- proxy.initialize(implementation,initParams) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#245)
	- pool.initReserve(input.underlyingAsset,aTokenProxyAddress,stableDebtTokenProxyAddress,variableDebtTokenProxyAddress,input.interestRateStrategyAddress) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#97-103)
	- pool.setConfiguration(input.underlyingAsset,currentConfig) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#113)
	Event emitted after the call(s):
	- ReserveInitialized(input.underlyingAsset,aTokenProxyAddress,stableDebtTokenProxyAddress,variableDebtTokenProxyAddress,input.interestRateStrategyAddress) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#115-121)
Reentrancy in ConfiguratorLogic.executeUpdateAToken(IPool,ConfiguratorInputTypes.UpdateATokenInput) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#130-153):
	External calls:
	- _upgradeTokenImplementation(reserveData.aTokenAddress,input.implementation,encodedCall) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#150)
		- proxy.upgradeToAndCall(implementation,initParams) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#266)
	Event emitted after the call(s):
	- ATokenUpgraded(input.asset,reserveData.aTokenAddress,input.implementation) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#152)
Reentrancy in ConfiguratorLogic.executeUpdateStableDebtToken(IPool,ConfiguratorInputTypes.UpdateDebtTokenInput) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#161-191):
	External calls:
	- _upgradeTokenImplementation(reserveData.stableDebtTokenAddress,input.implementation,encodedCall) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#180-184)
		- proxy.upgradeToAndCall(implementation,initParams) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#266)
	Event emitted after the call(s):
	- StableDebtTokenUpgraded(input.asset,reserveData.stableDebtTokenAddress,input.implementation) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#186-190)
Reentrancy in ConfiguratorLogic.executeUpdateVariableDebtToken(IPool,ConfiguratorInputTypes.UpdateDebtTokenInput) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#199-229):
	External calls:
	- _upgradeTokenImplementation(reserveData.variableDebtTokenAddress,input.implementation,encodedCall) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#218-222)
		- proxy.upgradeToAndCall(implementation,initParams) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#266)
	Event emitted after the call(s):
	- VariableDebtTokenUpgraded(input.asset,reserveData.variableDebtTokenAddress,input.implementation) (lib/aave-v3-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol#224-228)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3
INFO:Detectors:
Address.isContract(address) (lib/aave-v3-core/contracts/dependencies/openzeppelin/contracts/Address.sol#25-36) uses assembly
	- INLINE ASM (lib/aave-v3-core/contracts/dependencies/openzeppelin/contracts/Address.sol#32-34)
BaseUpgradeabilityProxy._implementation() (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/BaseUpgradeabilityProxy.sol#32-38) uses assembly
	- INLINE ASM (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/BaseUpgradeabilityProxy.sol#35-37)
BaseUpgradeabilityProxy._setImplementation(address) (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/BaseUpgradeabilityProxy.sol#53-65) uses assembly
	- INLINE ASM (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/BaseUpgradeabilityProxy.sol#62-64)
Proxy._delegate(address) (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/Proxy.sol#32-56) uses assembly
	- INLINE ASM (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/Proxy.sol#34-55)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#assembly-usage
INFO:Detectors:
Address.sendValue(address,uint256) (lib/aave-v3-core/contracts/dependencies/openzeppelin/contracts/Address.sol#54-60) is never used and should be removed
ReserveConfiguration.getActive(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#183-185) is never used and should be removed
ReserveConfiguration.getBorrowCap(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#383-387) is never used and should be removed
ReserveConfiguration.getBorrowableInIsolation(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#254-258) is never used and should be removed
ReserveConfiguration.getBorrowingEnabled(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#306-310) is never used and should be removed
ReserveConfiguration.getCaps(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#601-610) is never used and should be removed
ReserveConfiguration.getDebtCeiling(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#433-437) is never used and should be removed
ReserveConfiguration.getDecimals(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#161-165) is never used and should be removed
ReserveConfiguration.getEModeCategory(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#516-520) is never used and should be removed
ReserveConfiguration.getFlags(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#556-568) is never used and should be removed
ReserveConfiguration.getFlashLoanEnabled(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#541-545) is never used and should be removed
ReserveConfiguration.getFrozen(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#203-205) is never used and should be removed
ReserveConfiguration.getLiquidationBonus(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#136-140) is never used and should be removed
ReserveConfiguration.getLiquidationProtocolFee(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#463-468) is never used and should be removed
ReserveConfiguration.getLiquidationThreshold(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#109-113) is never used and should be removed
ReserveConfiguration.getLtv(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#84-86) is never used and should be removed
ReserveConfiguration.getPaused(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#223-225) is never used and should be removed
ReserveConfiguration.getReserveFactor(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#358-362) is never used and should be removed
ReserveConfiguration.getSiloedBorrowing(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#281-285) is never used and should be removed
ReserveConfiguration.getStableRateBorrowingEnabled(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#331-335) is never used and should be removed
ReserveConfiguration.getSupplyCap(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#408-412) is never used and should be removed
ReserveConfiguration.getUnbackedMintCap(DataTypes.ReserveConfigurationMap) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#491-495) is never used and should be removed
ReserveConfiguration.setBorrowCap(DataTypes.ReserveConfigurationMap,uint256) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#369-376) is never used and should be removed
ReserveConfiguration.setBorrowableInIsolation(DataTypes.ReserveConfigurationMap,bool) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#236-243) is never used and should be removed
ReserveConfiguration.setBorrowingEnabled(DataTypes.ReserveConfigurationMap,bool) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#292-299) is never used and should be removed
ReserveConfiguration.setDebtCeiling(DataTypes.ReserveConfigurationMap,uint256) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#419-426) is never used and should be removed
ReserveConfiguration.setEModeCategory(DataTypes.ReserveConfigurationMap,uint256) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#502-509) is never used and should be removed
ReserveConfiguration.setFlashLoanEnabled(DataTypes.ReserveConfigurationMap,bool) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#527-534) is never used and should be removed
ReserveConfiguration.setLiquidationBonus(DataTypes.ReserveConfigurationMap,uint256) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#120-129) is never used and should be removed
ReserveConfiguration.setLiquidationProtocolFee(DataTypes.ReserveConfigurationMap,uint256) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#444-456) is never used and should be removed
ReserveConfiguration.setLiquidationThreshold(DataTypes.ReserveConfigurationMap,uint256) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#93-102) is never used and should be removed
ReserveConfiguration.setLtv(DataTypes.ReserveConfigurationMap,uint256) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#73-77) is never used and should be removed
ReserveConfiguration.setReserveFactor(DataTypes.ReserveConfigurationMap,uint256) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#342-351) is never used and should be removed
ReserveConfiguration.setSiloedBorrowing(DataTypes.ReserveConfigurationMap,bool) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#266-273) is never used and should be removed
ReserveConfiguration.setStableRateBorrowingEnabled(DataTypes.ReserveConfigurationMap,bool) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#317-324) is never used and should be removed
ReserveConfiguration.setSupplyCap(DataTypes.ReserveConfigurationMap,uint256) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#394-401) is never used and should be removed
ReserveConfiguration.setUnbackedMintCap(DataTypes.ReserveConfigurationMap,uint256) (lib/aave-v3-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol#475-484) is never used and should be removed
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#dead-code
INFO:Detectors:
Low level call in Address.sendValue(address,uint256) (lib/aave-v3-core/contracts/dependencies/openzeppelin/contracts/Address.sol#54-60):
	- (success) = recipient.call{value: amount}() (lib/aave-v3-core/contracts/dependencies/openzeppelin/contracts/Address.sol#58)
Low level call in InitializableUpgradeabilityProxy.initialize(address,bytes) (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol#20-28):
	- (success) = _logic.delegatecall(_data) (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol#25)
Low level call in BaseImmutableAdminUpgradeabilityProxy.upgradeToAndCall(address,bytes) (lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol#69-76):
	- (success) = newImplementation.delegatecall(data) (lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol#74)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#low-level-calls
INFO:Detectors:
Parameter InitializableUpgradeabilityProxy.initialize(address,bytes)._logic (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol#20) is not in mixedCase
Parameter InitializableUpgradeabilityProxy.initialize(address,bytes)._data (lib/aave-v3-core/contracts/dependencies/openzeppelin/upgradeability/InitializableUpgradeabilityProxy.sol#20) is not in mixedCase
Function IPool.ADDRESSES_PROVIDER() (lib/aave-v3-core/contracts/interfaces/IPool.sol#621) is not in mixedCase
Function IPool.MAX_STABLE_RATE_BORROW_SIZE_PERCENT() (lib/aave-v3-core/contracts/interfaces/IPool.sol#684) is not in mixedCase
Function IPool.FLASHLOAN_PREMIUM_TOTAL() (lib/aave-v3-core/contracts/interfaces/IPool.sol#690) is not in mixedCase
Function IPool.BRIDGE_PROTOCOL_FEE() (lib/aave-v3-core/contracts/interfaces/IPool.sol#696) is not in mixedCase
Function IPool.FLASHLOAN_PREMIUM_TO_PROTOCOL() (lib/aave-v3-core/contracts/interfaces/IPool.sol#702) is not in mixedCase
Function IPool.MAX_NUMBER_RESERVES() (lib/aave-v3-core/contracts/interfaces/IPool.sol#708) is not in mixedCase
Variable BaseImmutableAdminUpgradeabilityProxy._admin (lib/aave-v3-core/contracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol#17) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions
INFO:Slither:0x7406aba1Aa5fE5cd71d958CE10fc28c416a33aA0 analyzed (16 contracts with 79 detectors), 63 result(s) found
```

</details>

<details>
<summary>Slither report for L2Pool at `0x764594F8e9757edE877B75716f8077162B251460`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0x764594F8e9757edE877B75716f8077162B251460
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x764594F8e9757edE877B75716f8077162B251460`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0x794a61358D6845594F94dc1DB02A252b5b4814aD
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for VariableDebtToken (VARIABLE_DEBT_TOKEN_IMPL) at `0x81387c40EB75acB02757C1Ae55D5936E78c9dEd3`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0x81387c40EB75acB02757C1Ae55D5936E78c9dEd3
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation PoolConfigurator at `0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0x8145eddDf43f50276641b55bd3AD95944510021E
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for AToken (ATOKEN_IMPL) at `0xa5ba6E5EC19a1Bf23C857991c857dB62b2Aa187B`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0xa5ba6E5EC19a1Bf23C857991c857dB62b2Aa187B
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for PoolAddressesProvider at `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0xD81eb3728a631871a7eBBaD631b5f424909f0c77
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for AaveProtocolDataProvider at `0xd9Ca4878dd38B021583c1B669905592EAe76E044`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0xd9Ca4878dd38B021583c1B669905592EAe76E044
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for EditableERC20 (Mai Stablecoin) at `0xdFA46478F9e5EA86d57387849598dbFB2e964b02`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0xdFA46478F9e5EA86d57387849598dbFB2e964b02
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

</details>
