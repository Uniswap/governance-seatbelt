## OptimismBridgeExecutor actionSet("8": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [16875938](https://etherscan.io/block/16875938) at 3/21/2023, 8:13:11 AM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/f9c961c8-fb70-4f7a-8e01-c00596cfbbbe](https://dashboard.tenderly.co/me/simulator/f9c961c8-fb70-4f7a-8e01-c00596cfbbbe)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`
@@ `_reserves` key `0x4200000000000000000000000000000000000006`.configuration.data @@
- 5708990773806294839799419126381297963416602419008
+ 5708990773806294839799419135604670000271378227008

# decoded configuration.data for key `0x4200000000000000000000000000000000000006` (symbol: WETH)
@@ configuration.data.reserveFactor @@
- 1000
+ 1500


```

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_queuedActions` key `0x05e163ad4ef9f777e9ee12a7aade775ecb5e3eb93406d77434d3d0be4ea3be1b` @@
- true
+ false

@@ `_actionsSets` key `"8"`.executed @@
- false
+ true

```

```diff
# unknown contract name at `0xDd81E6F85358292075B78fc8D5830BE8434aF8BA`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000002` @@
- "0x0000000000000000000000000000000000000000000000000000000000000004"
+ "0x0000000000000000000000000000000000000000000000000000000000000005"
@@ Slot `0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad2` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000c76ef342898f1ae7e6c4632627df683fad8563dd"
@@ Slot `0x6aeb1dfb2b58cfc4c552390b668fd30caeda0fb24d5328a09c3a1ebb31a6a0d9` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000c76ef342898f1ae7e6c4632627df683fad8563dd"
```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation unknown contract name at `0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xb46e2b82b0c2cf3d7d9dece53635e165c53e0eaa7a44f904d61a2b7174826aef","0x0000000000000000000000004200000000000000000000000000000000000006"],"data":"0x00000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000005dc"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xdb8dada53709ce4988154324196790c2e4a60c377e1256790946f83b87db3c33","0x00000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e58"],"data":"0x00000000000000000000000041b66b4b6b4c9dab039d96528d1b88f7baf8c5a4000000000000000000000000a9f3c3cae095527061e6d270dbe163693e6fda9d"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xdb8dada53709ce4988154324196790c2e4a60c377e1256790946f83b87db3c33","0x0000000000000000000000004200000000000000000000000000000000000006"],"data":"0x000000000000000000000000ee1bac9355eaafcd1b68d272d640d870bc9b4b5c000000000000000000000000c76ef342898f1ae7e6c4632627df683fad8563dd"}}`
  - unknown contract name at `0xDd81E6F85358292075B78fc8D5830BE8434aF8BA`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0xdd81e6f85358292075b78fc8d5830be8434af8ba","topics":["0x3378eea2a54404744f94089100239b7164fca47ac2da529398895f830297b5ed","0x000000000000000000000000c76ef342898f1ae7e6c4632627df683fad8563dd","0x6319431bab9361b74ea0ae6af574df19adbf3f3d07aeec130bd7803584469480"],"data":"0x00000000000000000000000000000000000000000295be96e640669720000000000000000000000000000000000000000000000000084595161401484a0000000000000000000000000000000000000000000000001f6ed020b26b45e600000000000000000000000000000000000000000000000295be96e640669720000000000000000000000000000000000000000000000000211654585005212800000000000000000000000000000000000000000000000295be96e64066972000000000000000000000000000000000000000000000000018d0bf423c03d8de000000000000000000000000000000000000000000000000295be96e64066972000000000000000000000000000000000000000000000000a56fa5b99019a5c8000000"}}`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 8, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x158a6bC04F0828318821baE797f50B0A1299d45b: EOA (verification not applicable)
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)
  - 0x2e2B1F112C4D79A9D22464F0D345dE9b792705f1: EOA (verification not applicable)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0x7902F3c60f05b5A6b7e4Ce0Cac11Cb17bC8e607c: Contract (not verified)
  - 0x7A9A9c14B35E58ffa1cC84aB421acE0FdcD289E3: Contract (not verified)
  - 0xDd81E6F85358292075B78fc8D5830BE8434aF8BA: Contract (not verified)
  - 0x85FB6dff5F59695d77cc61898e60D040165b1923: Contract (not verified)
  - 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb: Contract (verified) (PoolAddressesProvider)
  - 0x794a61358D6845594F94dc1DB02A252b5b4814aD: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0x270d4C1b6F0bB172A9fd628E29530Ca484190013: Contract (verified) (L2Pool)
  - 0x41B66b4b6b4c9dab039d96528D1b88f7BAF8C5A4: Contract (verified) (DefaultReserveInterestRateStrategy)
  - 0x8145eddDf43f50276641b55bd3AD95944510021E: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade: Contract (not verified)
  - 0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B: Contract (verified) (ACLManager)
  - 0xeE1BAc9355EaAfCD1B68d272d640d870bC9b4b5C: Contract (verified) (DefaultReserveInterestRateStrategy)
  - 0xc76EF342898f1AE7E6C4632627Df683FAD8563DD: EOA (verification not applicable)

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
<summary>View warnings for DefaultReserveInterestRateStrategy at `0x41B66b4b6b4c9dab039d96528D1b88f7BAF8C5A4`</summary>

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

<details>
<summary>View warnings for DefaultReserveInterestRateStrategy at `0xeE1BAc9355EaAfCD1B68d272d640d870bC9b4b5C`</summary>

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
<summary>Slither report for DefaultReserveInterestRateStrategy at `0x41B66b4b6b4c9dab039d96528D1b88f7BAF8C5A4`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x41B66b4b6b4c9dab039d96528D1b88f7BAF8C5A4 analyzed (0 contracts with 72 detectors), 0 result(s) found
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

<details>
<summary>Slither report for DefaultReserveInterestRateStrategy at `0xeE1BAc9355EaAfCD1B68d272d640d870bC9b4b5C`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0xeE1BAc9355EaAfCD1B68d272d640d870bC9b4b5C analyzed (0 contracts with 72 detectors), 0 result(s) found
```

</details>

</details>
