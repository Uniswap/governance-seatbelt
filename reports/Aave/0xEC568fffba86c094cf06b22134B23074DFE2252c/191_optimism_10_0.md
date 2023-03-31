## OptimismBridgeExecutor actionSet("10": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [16946073](https://etherscan.io/block/16946073) at 3/31/2023, 4:43:23 AM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/eeb6b188-137d-4eb6-a2b9-aab011cfe566](https://dashboard.tenderly.co/me/simulator/eeb6b188-137d-4eb6-a2b9-aab011cfe566)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# unknown contract name at `0x3EF10DFf4928279c004308EbADc4Db8B7620d6fc`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000000` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000001"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000035` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0xbc7fecd0c20ce16976772713657bb71cd0d85c2e765497ff7ce334cea550b93d"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000037` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003b` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x41617665204f7074696d69736d20537461626c652044656274204c555344003c"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003c` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x737461626c65446562744f70744c555344000000000000000000000000000022"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000929ec64c34a17401f460460d4b9390518e5b473e12"
@@ Slot `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x00000000000000000000000052a1ceb68ee6b7b5d13e0376a1e0e4423a8ce26e"
```

```diff
# InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`
@@ _reservesCount @@
- 10
+ 11
@@ Slot `0x76aacc2028d991243e90f9a326795e305ddcc7830dc0c1d3a776810a5954c285` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"
@@ `_reserves` key `0xc40f949f8a4e094d1b49a23ea9241d289b7b2819`.configuration.data @@
- 0
+ 249230249211134526429644634532188403007488
@@ `_reserves` key `0xc40f949f8a4e094d1b49a23ea9241d289b7b2819`.liquidityIndex @@
- 0
+ 1000000000000000000000000000
@@ `_reserves` key `0xc40f949f8a4e094d1b49a23ea9241d289b7b2819`.currentVariableBorrowRate @@
- 0
+ 2394058978
@@ `_reserves` key `0xc40f949f8a4e094d1b49a23ea9241d289b7b2819`.currentStableBorrowRate @@
- 0
+ 97242138940289186623854608478927640316
@@ `_reserves` key `0xc40f949f8a4e094d1b49a23ea9241d289b7b2819`.lastUpdateTimestamp @@
- 0
+ 3457707884

# decoded configuration.data for key `0xc40f949f8a4e094d1b49a23ea9241d289b7b2819` (symbol: LUSD)
@@ configuration.data.ltv @@
- 0
+ 0
@@ configuration.data.liquidationThreshold @@
- 0
+ 0
@@ configuration.data.liquidationBonus @@
- 0
+ 0
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
+ 1000
@@ configuration.data.borrowCap @@
- 0
+ 1210000
@@ configuration.data.supplyCap @@
- 0
+ 3000000
@@ configuration.data.liquidationProtocolFee @@
- 0
+ 0
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
@@ `_queuedActions` key `0x50a429ef45f8ef051ed93b883cd93b653bb55702037fa2f25128727d418d9d15` @@
- true
+ false

@@ `_actionsSets` key `"10"`.executed @@
- false
+ true

```

```diff
# unknown contract name at `0x8Eb270e296023E9D92081fdF967dDd7878724424`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000000` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000001"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000037` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x41617665204f7074696d69736d204c5553440000000000000000000000000024"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000038` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x614f70744c555344000000000000000000000000000000000000000000000010"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000039` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000929ec64c34a17401f460460d4b9390518e5b473e12"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003b` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0xb2b20dfaf942356e41262b553d217b453078752cd88b34b49f1af8afa6165017"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003c` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000b2289e329d2f85f1ed31adbb30ea345278f21bcf"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"
@@ Slot `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000a5ba6e5ec19a1bf23c857991c857db62b2aa187b"
```

```diff
# unknown contract name at `0xCE186F6Cccb0c955445bb9d10C59caE488Fea559`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000000` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000001"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000035` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x6d16241a611476b5a404254084ab309235a1c1d6f9b0e1436b55ffca6be9316a"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000037` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003b` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000041"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003c` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x7661726961626c65446562744f70744c55534400000000000000000000000026"
@@ Slot `0x000000000000000000000000000000000000000000000000000000000000003d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000929ec64c34a17401f460460d4b9390518e5b473e12"
@@ Slot `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x00000000000000000000000081387c40eb75acb02757c1ae55d5936e78c9ded3"
@@ Slot `0xbbe3212124853f8b0084a66a2d057c2966e251e132af3691db153ab65f0d1a4d` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x41617665204f7074696d69736d205661726961626c652044656274204c555344"
```

```diff
# AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`
@@ `assetsSources` key `0xc40f949f8a4e094d1b49a23ea9241d289b7b2819` @@
- 0x0000000000000000000000000000000000000000
+ 0x9dfc79aaeb5bb0f96c6e9402671981cdfc424052

```

```diff
# unknown contract name at `0xDd81E6F85358292075B78fc8D5830BE8434aF8BA`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000002` @@
- "0x0000000000000000000000000000000000000000000000000000000000000005"
+ "0x0000000000000000000000000000000000000000000000000000000000000006"
@@ Slot `0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad3` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000271f5f8325051f22cada18ffedd4a805584a232a"
@@ Slot `0x9965d88f8f23facc90714459d1d79c870eb94a66c0a6f803e932c58749350d28` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000271f5f8325051f22cada18ffedd4a805584a232a"
```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`
    - `AssetSourceUpdated(asset: 0xc40f949f8a4e094d1b49a23ea9241d289b7b2819, source: 0x9dfc79aaeb5bb0f96c6e9402671981cdfc424052)`
  - unknown contract name at `0xDd81E6F85358292075B78fc8D5830BE8434aF8BA`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0xdd81e6f85358292075b78fc8d5830be8434af8ba","topics":["0x3378eea2a54404744f94089100239b7164fca47ac2da529398895f830297b5ed","0x000000000000000000000000271f5f8325051f22cada18ffedd4a805584a232a","0xdfd9bf0bded3d9b867ff70cea02cd6d55b60b7fdc117fbd875742ebd9e0e73d4"],"data":"0x00000000000000000000000000000000000000000295be96e64066972000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002116545850052128000000000000000000000000000000000000000000000002cfa5aa80cc6f91260000000000000000000000000000000000000000000000002116545850052128000000000000000000000000000000000000000000000002cfa5aa80cc6f9126000000000000000000000000000000000000000000000000084595161401484a000000000000000000000000000000000000000000000000422ca8b0a00a4250000000000000000000000000000000000000000000000000a56fa5b99019a5c8000000"}}`
  - unknown contract name at `0x8Eb270e296023E9D92081fdF967dDd7878724424`
    - `Initialized(underlyingAsset: 0xc40f949f8a4e094d1b49a23ea9241d289b7b2819, pool: 0x794a61358d6845594f94dc1db02a252b5b4814ad, treasury: 0xb2289e329d2f85f1ed31adbb30ea345278f21bcf, incentivesController: 0x929ec64c34a17401f460460d4b9390518e5b473e, aTokenDecimals: 18, aTokenName: Aave Optimism LUSD, aTokenSymbol: aOptLUSD, params: 0x)`
  - unknown contract name at `0x3EF10DFf4928279c004308EbADc4Db8B7620d6fc`
    - `Initialized(underlyingAsset: 0xc40f949f8a4e094d1b49a23ea9241d289b7b2819, pool: 0x794a61358d6845594f94dc1db02a252b5b4814ad, incentivesController: 0x929ec64c34a17401f460460d4b9390518e5b473e, debtTokenDecimals: 18, debtTokenName: Aave Optimism Stable Debt LUSD, debtTokenSymbol: stableDebtOptLUSD, params: 0x)`
  - unknown contract name at `0xCE186F6Cccb0c955445bb9d10C59caE488Fea559`
    - `Initialized(underlyingAsset: 0xc40f949f8a4e094d1b49a23ea9241d289b7b2819, pool: 0x794a61358d6845594f94dc1db02a252b5b4814ad, incentivesController: 0x929ec64c34a17401f460460d4b9390518e5b473e, debtTokenDecimals: 18, debtTokenName: Aave Optimism Variable Debt LUSD, debtTokenSymbol: variableDebtOptLUSD, params: 0x)`
  - InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation unknown contract name at `0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade`
    - `ReserveInitialized(asset: 0xc40f949f8a4e094d1b49a23ea9241d289b7b2819, aToken: 0x8eb270e296023e9d92081fdf967ddd7878724424, stableDebtToken: 0x3ef10dff4928279c004308ebadc4db8b7620d6fc, variableDebtToken: 0xce186f6cccb0c955445bb9d10c59cae488fea559, interestRateStrategyAddress: 0x271f5f8325051f22cada18ffedd4a805584a232a)`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x0263602682188540a2d633561c0b4453b7d8566285e99f9f6018b8ef2facef49","0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"],"data":"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002dc6c0"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"],"data":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000127690"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x2443ba28e8d1d88d531a3d90b981816a4f3b3c7f1fd4085c6029e81d1b7a570d","0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"],"data":"0x0000000000000000000000000000000000000000000000000000000000000001"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x0b64d0941719acd363f1a6be3d8525d8ec9d71738f7445aabcd88d7939b472e7","0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"],"data":"0x0000000000000000000000000000000000000000000000000000000000000000"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x74adf6aaf58c08bc4f993640385e136522375ea3d1589a10d02adbb906c67d1c"],"data":"0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b28190000000000000000000000000000000000000000000000000000000000000000"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x842a280b07e8e502a9101f32a3b768ebaba3655556dd674f0831900861fc674b","0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"],"data":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xb46e2b82b0c2cf3d7d9dece53635e165c53e0eaa7a44f904d61a2b7174826aef","0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"],"data":"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e8"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x5bb69795b6a2ea222d73a5f8939c23471a1f85a99c7ca43c207f1b71f10c6264","0x000000000000000000000000c40f949f8a4e094d1b49a23ea9241d289b7b2819"],"data":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"}}`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 10, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0xF585F8cf39C1ef5353326e0352B9E237f9A52587: Contract (not verified)
  - 0x7A9A9c14B35E58ffa1cC84aB421acE0FdcD289E3: Contract (not verified)
  - 0x9dfc79Aaeb5bb0f96C6e9402671981CdFc424052: Contract (not verified)
  - 0x19dC743a5E9a73eefAbA7047C7CEeBc650F37336: Contract (verified) (AccessControlledOffchainAggregator)
  - 0xD81eb3728a631871a7eBBaD631b5f424909f0c77: Contract (verified) (AaveOracle)
  - 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb: Contract (verified) (PoolAddressesProvider)
  - 0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B: Contract (verified) (ACLManager)
  - 0xDd81E6F85358292075B78fc8D5830BE8434aF8BA: Contract (not verified)
  - 0x85FB6dff5F59695d77cc61898e60D040165b1923: Contract (not verified)
  - 0x271f5f8325051f22caDa18FfedD4a805584a232A: EOA (verification not applicable)
  - 0xc40F949F8a4e094D1b49a23ea9241D289B7b2819: Contract (verified) (L2StandardERC20)
  - 0x8145eddDf43f50276641b55bd3AD95944510021E: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade: Contract (not verified)
  - 0x99e323f0479DC509df70559b3Ff50785DdBD692E: Contract (verified) (ConfiguratorLogic)
  - 0x8Eb270e296023E9D92081fdF967dDd7878724424: Contract (not verified)
  - 0xa5ba6E5EC19a1Bf23C857991c857dB62b2Aa187B: Contract (verified) (AToken)
  - 0x3EF10DFf4928279c004308EbADc4Db8B7620d6fc: Contract (not verified)
  - 0x52A1CeB68Ee6b7B5D13E0376A1E0E4423A8cE26e: Contract (verified) (StableDebtToken)
  - 0xCE186F6Cccb0c955445bb9d10C59caE488Fea559: Contract (not verified)
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
<summary>View warnings for AccessControlledOffchainAggregator at `0x19dC743a5E9a73eefAbA7047C7CEeBc650F37336`</summary>

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
<summary>View warnings for L2StandardERC20 at `0xc40F949F8a4e094D1b49a23ea9241D289B7b2819`</summary>

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
<summary>Slither report for AccessControlledOffchainAggregator at `0x19dC743a5E9a73eefAbA7047C7CEeBc650F37336`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x19dC743a5E9a73eefAbA7047C7CEeBc650F37336 analyzed (0 contracts with 72 detectors), 0 result(s) found
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
<summary>Slither report for L2StandardERC20 at `0xc40F949F8a4e094D1b49a23ea9241D289B7b2819`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0xc40F949F8a4e094D1b49a23ea9241D289B7b2819 analyzed (0 contracts with 72 detectors), 0 result(s) found
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
