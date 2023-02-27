## OptimismBridgeExecutor actionSet("7": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [16718356](https://etherscan.io/block/16718356) at 2/27/2023, 3:30:47 AM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/3e8bd700-a182-41a7-826f-50c02224dad0](https://dashboard.tenderly.co/me/simulator/3e8bd700-a182-41a7-826f-50c02224dad0)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`
@@ `_reserves` key `0x68f180fcce6836688e9084f035309e29bf0a2095`.configuration.data @@
- 5708990770915223948944088281074834866010195762008
+ 5708990770915223948944088281074834865752497724248

# decoded configuration.data for key `0x68f180fcce6836688e9084f035309e29bf0a2095` (symbol: WBTC)
@@ configuration.data.liquidationBonus @@
- 11000
+ 10940

@@ `_reserves` key `0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9`.configuration.data @@
- 379853411589069981315521302201372368401207407679344
+ 379853411589069981315521302201372368401379206371184

# decoded configuration.data for key `0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9` (symbol: sUSD)
@@ configuration.data.liquidationBonus @@
- 10500
+ 10540

```

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_actionsSets` key `"7"`.executed @@
- false
+ true

@@ `_queuedActions` key `0xc2a770e5515fa27c78afc26ad9e3c4e7616e7ecf70a3f343a3d99e2c0644dc76` @@
- true
+ false

```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation unknown contract name at `0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade`
    - `CollateralConfigurationChanged(asset: 0x68f180fcce6836688e9084f035309e29bf0a2095, ltv: 7000, liquidationThreshold: 7500, liquidationBonus: 10940)`
    - `CollateralConfigurationChanged(asset: 0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9, ltv: 6000, liquidationThreshold: 7500, liquidationBonus: 10540)`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 7, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0x6bcE15B789e537f3abA3C60CB183F0E8737f05eC: Contract (verified) (AaveV3OptCapsPayload)
  - 0x8145eddDf43f50276641b55bd3AD95944510021E: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade: Contract (not verified)
  - 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb: Contract (verified) (PoolAddressesProvider)
  - 0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B: Contract (verified) (ACLManager)
  - 0x794a61358D6845594F94dc1DB02A252b5b4814aD: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0x270d4C1b6F0bB172A9fd628E29530Ca484190013: Contract (verified) (L2Pool)

#### Runs solc against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>
<details>
<summary>View warnings for L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`</summary>

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
<summary>View warnings for InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation unknown contract name at `0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade`</summary>

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

</details>

#### Runs slither against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>

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
<summary>Slither report for AaveV3OptCapsPayload at `0x6bcE15B789e537f3abA3C60CB183F0E8737f05eC`</summary>

```

DefaultReserveInterestRateStrategy.calculateInterestRates(address,uint256,uint256,uint256,uint256,uint256).vars (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#134) is a local variable never initialized
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-local-variables

DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).baseVariableBorrowRate (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#59) shadows:
	- DefaultReserveInterestRateStrategy.baseVariableBorrowRate() (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#91-93) (function)
	- IReserveInterestRateStrategy.baseVariableBorrowRate() (@aave/protocol-v2/contracts/interfaces/IReserveInterestRateStrategy.sol#10) (function)
DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).variableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#60) shadows:
	- DefaultReserveInterestRateStrategy.variableRateSlope1() (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#75-77) (function)
DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).variableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#61) shadows:
	- DefaultReserveInterestRateStrategy.variableRateSlope2() (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#79-81) (function)
DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).stableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#62) shadows:
	- DefaultReserveInterestRateStrategy.stableRateSlope1() (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#83-85) (function)
DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).stableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#63) shadows:
	- DefaultReserveInterestRateStrategy.stableRateSlope2() (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#87-89) (function)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#local-variable-shadowing

PercentageMath.percentDiv(uint256,uint256) (@aave/protocol-v2/contracts/protocol/libraries/math/PercentageMath.sol#43-53) is never used and should be removed
SafeMath.div(uint256,uint256) (@aave/protocol-v2/contracts/dependencies/openzeppelin/contracts/SafeMath.sol#101-103) is never used and should be removed
SafeMath.div(uint256,uint256,string) (@aave/protocol-v2/contracts/dependencies/openzeppelin/contracts/SafeMath.sol#116-127) is never used and should be removed
SafeMath.mod(uint256,uint256) (@aave/protocol-v2/contracts/dependencies/openzeppelin/contracts/SafeMath.sol#140-142) is never used and should be removed
SafeMath.mod(uint256,uint256,string) (@aave/protocol-v2/contracts/dependencies/openzeppelin/contracts/SafeMath.sol#155-162) is never used and should be removed
SafeMath.mul(uint256,uint256) (@aave/protocol-v2/contracts/dependencies/openzeppelin/contracts/SafeMath.sol#76-88) is never used and should be removed
WadRayMath.halfRay() (@aave/protocol-v2/contracts/protocol/libraries/math/WadRayMath.sol#39-41) is never used and should be removed
WadRayMath.halfWad() (@aave/protocol-v2/contracts/protocol/libraries/math/WadRayMath.sol#46-48) is never used and should be removed
WadRayMath.rayToWad(uint256) (@aave/protocol-v2/contracts/protocol/libraries/math/WadRayMath.sol#117-123) is never used and should be removed
WadRayMath.wad() (@aave/protocol-v2/contracts/protocol/libraries/math/WadRayMath.sol#32-34) is never used and should be removed
WadRayMath.wadDiv(uint256,uint256) (@aave/protocol-v2/contracts/protocol/libraries/math/WadRayMath.sol#72-79) is never used and should be removed
WadRayMath.wadMul(uint256,uint256) (@aave/protocol-v2/contracts/protocol/libraries/math/WadRayMath.sol#56-64) is never used and should be removed
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#dead-code

Variable DefaultReserveInterestRateStrategy.OPTIMAL_UTILIZATION_RATE (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#29) is not in mixedCase
Variable DefaultReserveInterestRateStrategy.EXCESS_UTILIZATION_RATE (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#37) is not in mixedCase
Variable DefaultReserveInterestRateStrategy._baseVariableBorrowRate (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#42) is not in mixedCase
Variable DefaultReserveInterestRateStrategy._variableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#45) is not in mixedCase
Variable DefaultReserveInterestRateStrategy._variableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#48) is not in mixedCase
Variable DefaultReserveInterestRateStrategy._stableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#51) is not in mixedCase
Variable DefaultReserveInterestRateStrategy._stableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#54) is not in mixedCase
Constant WadRayMath.halfWAD (@aave/protocol-v2/contracts/protocol/libraries/math/WadRayMath.sol#14) is not in UPPER_CASE_WITH_UNDERSCORES
Constant WadRayMath.halfRAY (@aave/protocol-v2/contracts/protocol/libraries/math/WadRayMath.sol#17) is not in UPPER_CASE_WITH_UNDERSCORES
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions

Variable DefaultReserveInterestRateStrategy._stableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#51) is too similar to DefaultReserveInterestRateStrategy._stableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#54)
Variable DefaultReserveInterestRateStrategy._variableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#45) is too similar to DefaultReserveInterestRateStrategy._variableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#48)
Variable DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).stableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#62) is too similar to DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).stableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#63)
Variable DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).variableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#60) is too similar to DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).variableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#61)
Variable Errors.LP_INCONSISTENT_FLASHLOAN_PARAMS (@aave/protocol-v2/contracts/protocol/libraries/helpers/Errors.sol#55) is too similar to Errors.VL_INCONSISTENT_FLASHLOAN_PARAMS (@aave/protocol-v2/contracts/protocol/libraries/helpers/Errors.sol#100)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#variable-names-are-too-similar
0x6bcE15B789e537f3abA3C60CB183F0E8737f05eC analyzed (8 contracts with 72 detectors), 32 result(s) found
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
<summary>Slither report for InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation unknown contract name at `0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x8145eddDf43f50276641b55bd3AD95944510021E analyzed (0 contracts with 72 detectors), 0 result(s) found
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

</details>
