## OptimismBridgeExecutor actionSet("5": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [16684151](https://etherscan.io/block/16684151) at 2/22/2023, 8:02:23 AM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/71e0ea4b-b266-42ae-a6d3-30fd2354e06e](https://dashboard.tenderly.co/me/simulator/71e0ea4b-b266-42ae-a6d3-30fd2354e06e)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# unknown contract name at `0x34e2eD44EF7466D5f9E0b782B5c08b57475e7907`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000000` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000001"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000035` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x91473dac744cb991829ff421d4fafa129a18f622b14cd421aac17b2e52a39fcb"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000037` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000001f32b1c2345538c0c6f582fcb022739c4a194ebb"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003b` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000045"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003c` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x7661726961626c65446562744f7074777374455448000000000000000000002a"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000929ec64c34a17401f460460d4b9390518e5b473e12"
@@ Slot `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x00000000000000000000000081387c40eb75acb02757c1ae55d5936e78c9ded3"
@@ Slot `0xbbe3212124853f8b0084a66a2d057c2966e251e132af3691db153ab65f0d1a4d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x41617665204f7074696d69736d205661726961626c6520446562742077737445"
@@ Slot `0xbbe3212124853f8b0084a66a2d057c2966e251e132af3691db153ab65f0d1a4e` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x5448000000000000000000000000000000000000000000000000000000000000"
```

```diff
# unknown contract name at `0x78246294a4c6fBf614Ed73CcC9F8b875ca8eE841`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000000` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000001"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000035` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x1626fde9b4f12c8d788a4fa1adcbe18c26ac22500376a90ad6e78e930113ac12"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000037` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000001f32b1c2345538c0c6f582fcb022739c4a194ebb"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003b` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000041"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003c` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x737461626c65446562744f707477737445544800000000000000000000000026"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000929ec64c34a17401f460460d4b9390518e5b473e12"
@@ Slot `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x00000000000000000000000052a1ceb68ee6b7b5d13e0376a1e0e4423a8ce26e"
@@ Slot `0xbbe3212124853f8b0084a66a2d057c2966e251e132af3691db153ab65f0d1a4d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x41617665204f7074696d69736d20537461626c65204465627420777374455448"
```

```diff
# InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`
@@ _reservesCount @@
- 9
+ 10
@@ Slot `0x748ad6d0c5a24a04515706b6da6a7b0cb9e1a9408b9f3a5672a42f933d02d13e` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000001f32b1c2345538c0c6f582fcb022739c4a194ebb"
@@ `_reserves` key `0x1f32b1c2345538c0c6f582fcb022739c4a194ebb`.configuration.data @@
- 0
+ 5708990771322300022653623748077827455687004527448
@@ `_reserves` key `0x1f32b1c2345538c0c6f582fcb022739c4a194ebb`.liquidityIndex @@
- 0
+ 1000000000000000000000000000
@@ `_reserves` key `0x1f32b1c2345538c0c6f582fcb022739c4a194ebb`.currentVariableBorrowRate @@
- 0
+ 3294250904
@@ `_reserves` key `0x1f32b1c2345538c0c6f582fcb022739c4a194ebb`.currentStableBorrowRate @@
- 0
+ 219026576468131356570487329477792557121
@@ `_reserves` key `0x1f32b1c2345538c0c6f582fcb022739c4a194ebb`.lastUpdateTimestamp @@
- 0
+ 887287108

# decoded configuration.data for key `0x1f32b1c2345538c0c6f582fcb022739c4a194ebb` (symbol: wstETH)
@@ configuration.data.ltv @@
- 0
+ 7000
@@ configuration.data.liquidationThreshold @@
- 0
+ 7900
@@ configuration.data.liquidationBonus @@
- 0
+ 10720
@@ configuration.data.decimals @@
- 0
+ 18
@@ configuration.data.active @@
- false
+ true
@@ configuration.data.borrowingEnabled @@
- false
+ true
@@ configuration.data.reserveFactor @@
- 0
+ 1500
@@ configuration.data.borrowCap @@
- 0
+ 940
@@ configuration.data.supplyCap @@
- 0
+ 6000
@@ configuration.data.liquidationProtocolFee @@
- 0
+ 1000
@@ configuration.data.eModeCategory @@
- 0
+ 0
@@ configuration.data.unbackedMintCap @@
- 0
+ 0
@@ configuration.data.debtCeiling @@
- 0
+ 0

```

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_queuedActions` key `0x3e1604fdede8383b91a6e656b48f88ab1b79e367d0dfd3160f5d460df1900c59` @@
- true
+ false

@@ `_actionsSets` key `"5"`.executed @@
- false
+ true

```

```diff
# unknown contract name at `0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000000` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000001"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000037` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x41617665204f7074696d69736d20777374455448000000000000000000000028"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000038` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x614f707477737445544800000000000000000000000000000000000000000014"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000039` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000929ec64c34a17401f460460d4b9390518e5b473e12"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003b` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x921fb53c3b5b4d2beaa2f99d0ef961a97af7e22c59242ce876d68478ec7fc157"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003c` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000b2289e329d2f85f1ed31adbb30ea345278f21bcf"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000001f32b1c2345538c0c6f582fcb022739c4a194ebb"
@@ Slot `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000a5ba6e5ec19a1bf23c857991c857db62b2aa187b"
```

```diff
# AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`
@@ `assetsSources` key `0x1f32b1c2345538c0c6f582fcb022739c4a194ebb` @@
- 0x0000000000000000000000000000000000000000
+ 0x698b585cbc4407e2d54aa898b2600b53c68958f7

```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`
    - `AssetSourceUpdated(asset: 0x1f32b1c2345538c0c6f582fcb022739c4a194ebb, source: 0x698b585cbc4407e2d54aa898b2600b53c68958f7)`
  - unknown contract name at `0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA`
    - `Initialized(underlyingAsset: 0x1f32b1c2345538c0c6f582fcb022739c4a194ebb, pool: 0x794a61358d6845594f94dc1db02a252b5b4814ad, treasury: 0xb2289e329d2f85f1ed31adbb30ea345278f21bcf, incentivesController: 0x929ec64c34a17401f460460d4b9390518e5b473e, aTokenDecimals: 18, aTokenName: Aave Optimism wstETH, aTokenSymbol: aOptwstETH, params: 0x)`
  - unknown contract name at `0x78246294a4c6fBf614Ed73CcC9F8b875ca8eE841`
    - `Initialized(underlyingAsset: 0x1f32b1c2345538c0c6f582fcb022739c4a194ebb, pool: 0x794a61358d6845594f94dc1db02a252b5b4814ad, incentivesController: 0x929ec64c34a17401f460460d4b9390518e5b473e, debtTokenDecimals: 18, debtTokenName: Aave Optimism Stable Debt wstETH, debtTokenSymbol: stableDebtOptwstETH, params: 0x)`
  - unknown contract name at `0x34e2eD44EF7466D5f9E0b782B5c08b57475e7907`
    - `Initialized(underlyingAsset: 0x1f32b1c2345538c0c6f582fcb022739c4a194ebb, pool: 0x794a61358d6845594f94dc1db02a252b5b4814ad, incentivesController: 0x929ec64c34a17401f460460d4b9390518e5b473e, debtTokenDecimals: 18, debtTokenName: Aave Optimism Variable Debt wstETH, debtTokenSymbol: variableDebtOptwstETH, params: 0x)`
  - InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation unknown contract name at `0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade`
    - `ReserveInitialized(asset: 0x1f32b1c2345538c0c6f582fcb022739c4a194ebb, aToken: 0xc45a479877e1e9dfe9fcd4056c699575a1045daa, stableDebtToken: 0x78246294a4c6fbf614ed73ccc9f8b875ca8ee841, variableDebtToken: 0x34e2ed44ef7466d5f9e0b782b5c08b57475e7907, interestRateStrategyAddress: 0x6ba97468e2e6a3711a6dd05f0075d48e878c910e)`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x0263602682188540a2d633561c0b4453b7d8566285e99f9f6018b8ef2facef49","0x0000000000000000000000001f32b1c2345538c0c6f582fcb022739c4a194ebb"],"data":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001770"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x0000000000000000000000001f32b1c2345538c0c6f582fcb022739c4a194ebb"],"data":"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003ac"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x2443ba28e8d1d88d531a3d90b981816a4f3b3c7f1fd4085c6029e81d1b7a570d","0x0000000000000000000000001f32b1c2345538c0c6f582fcb022739c4a194ebb"],"data":"0x0000000000000000000000000000000000000000000000000000000000000001"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xb46e2b82b0c2cf3d7d9dece53635e165c53e0eaa7a44f904d61a2b7174826aef","0x0000000000000000000000001f32b1c2345538c0c6f582fcb022739c4a194ebb"],"data":"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005dc"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x637febbda9275aea2e85c0ff690444c8d87eb2e8339bbede9715abcc89cb0995","0x0000000000000000000000001f32b1c2345538c0c6f582fcb022739c4a194ebb"],"data":"0x0000000000000000000000000000000000000000000000000000000000001b580000000000000000000000000000000000000000000000000000000000001edc00000000000000000000000000000000000000000000000000000000000029e0"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xb5b0a963825337808b6e3154de8e98027595a5cad4219bb3a9bc55b192f4b391","0x0000000000000000000000001f32b1c2345538c0c6f582fcb022739c4a194ebb"],"data":"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e8"}}`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 5, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0x84893EE84e773E4a7a5738BD903dBE2a6E636B9e: Contract (not verified)
  - 0x7b8Fa4540246554e77FCFf140f9114de00F8bB8D: Contract (not verified)
  - 0x698B585CbC4407e2D54aa898B2600B53C68958f7: Contract (not verified)
  - 0x0d110cC7876d73c3C4190324bCF4C59416bBD259: Contract (verified) (AccessControlledOffchainAggregator)
  - 0xD81eb3728a631871a7eBBaD631b5f424909f0c77: Contract (verified) (AaveOracle)
  - 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb: Contract (verified) (PoolAddressesProvider)
  - 0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B: Contract (verified) (ACLManager)
  - 0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb: Contract (verified) (OssifiableProxy)
  - 0x92834c37dF982A13bb0f8C3F6608E26F0546538e: Contract (verified) (ERC20Bridged)
  - 0x8145eddDf43f50276641b55bd3AD95944510021E: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade: Contract (not verified)
  - 0x99e323f0479DC509df70559b3Ff50785DdBD692E: Contract (verified) (ConfiguratorLogic)
  - 0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA: Contract (not verified)
  - 0xa5ba6E5EC19a1Bf23C857991c857dB62b2Aa187B: Contract (verified) (AToken)
  - 0x78246294a4c6fBf614Ed73CcC9F8b875ca8eE841: Contract (not verified)
  - 0x52A1CeB68Ee6b7B5D13E0376A1E0E4423A8cE26e: Contract (verified) (StableDebtToken)
  - 0x34e2eD44EF7466D5f9E0b782B5c08b57475e7907: Contract (not verified)
  - 0x81387c40EB75acB02757C1Ae55D5936E78c9dEd3: Contract (verified) (VariableDebtToken)
  - 0x794a61358D6845594F94dc1DB02A252b5b4814aD: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0x270d4C1b6F0bB172A9fd628E29530Ca484190013: Contract (verified) (L2Pool)
  - 0x1c78508221B5f2533Df490929D59b7191A2c6E65: Contract (verified) (PoolLogic)

#### Runs solc against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>
<details>
<summary>View warnings for AccessControlledOffchainAggregator at `0x0d110cC7876d73c3C4190324bCF4C59416bBD259`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for PoolLogic at `0x1c78508221B5f2533Df490929D59b7191A2c6E65`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for OssifiableProxy at `0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb` with implementation ERC20Bridged (Wrapped liquid staked Ether 2.0) at `0x92834c37dF982A13bb0f8C3F6608E26F0546538e`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`</summary>

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
<summary>View warnings for InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`</summary>

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
<summary>View warnings for InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation unknown contract name at `0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for ERC20Bridged (Wrapped liquid staked Ether 2.0) at `0x92834c37dF982A13bb0f8C3F6608E26F0546538e`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for ConfiguratorLogic at `0x99e323f0479DC509df70559b3Ff50785DdBD692E`</summary>

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

</details>

#### Runs slither against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>

<details>
<summary>Slither report for AccessControlledOffchainAggregator at `0x0d110cC7876d73c3C4190324bCF4C59416bBD259`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x0d110cC7876d73c3C4190324bCF4C59416bBD259 analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for PoolLogic at `0x1c78508221B5f2533Df490929D59b7191A2c6E65`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x1c78508221B5f2533Df490929D59b7191A2c6E65 analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for OssifiableProxy at `0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb` with implementation ERC20Bridged (Wrapped liquid staked Ether 2.0) at `0x92834c37dF982A13bb0f8C3F6608E26F0546538e`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x270d4C1b6F0bB172A9fd628E29530Ca484190013 analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for StableDebtToken (STABLE_DEBT_TOKEN_IMPL) at `0x52A1CeB68Ee6b7B5D13E0376A1E0E4423A8cE26e`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x52A1CeB68Ee6b7B5D13E0376A1E0E4423A8cE26e analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x794a61358D6845594F94dc1DB02A252b5b4814aD analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x7d9103572bE58FfE99dc390E8246f02dcAe6f611 analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for VariableDebtToken (VARIABLE_DEBT_TOKEN_IMPL) at `0x81387c40EB75acB02757C1Ae55D5936E78c9dEd3`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x81387c40EB75acB02757C1Ae55D5936E78c9dEd3 analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation unknown contract name at `0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x8145eddDf43f50276641b55bd3AD95944510021E analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for ERC20Bridged (Wrapped liquid staked Ether 2.0) at `0x92834c37dF982A13bb0f8C3F6608E26F0546538e`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x92834c37dF982A13bb0f8C3F6608E26F0546538e analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for ConfiguratorLogic at `0x99e323f0479DC509df70559b3Ff50785DdBD692E`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x99e323f0479DC509df70559b3Ff50785DdBD692E analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for AToken (ATOKEN_IMPL) at `0xa5ba6E5EC19a1Bf23C857991c857dB62b2Aa187B`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0xa5ba6E5EC19a1Bf23C857991c857dB62b2Aa187B analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for PoolAddressesProvider at `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0xD81eb3728a631871a7eBBaD631b5f424909f0c77 analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

</details>
