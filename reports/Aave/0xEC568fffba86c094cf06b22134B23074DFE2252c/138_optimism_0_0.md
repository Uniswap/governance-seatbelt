## OptimismBridgeExecutor actionSet("0": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [16248214](https://etherscan.io/block/16248214) at 12/23/2022, 10:07:47 AM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/5e01609c-873e-4a67-be00-c7bce688ca55](https://dashboard.tenderly.co/me/simulator/5e01609c-873e-4a67-be00-c7bce688ca55)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`
@@ `_reserves` key `0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6`.configuration.data @@
- 5708990770823839524233143914691834094714991942488
+ 5708990770823839524404690488495149974605798316888

# decoded configuration.data for key `0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6` (symbol: LINK)
@@ configuration.data.borrowCap @@
- 0
+ 141900

@@ `_reserves` key `0x4200000000000000000000000000000000000006`.configuration.data @@
- 5708990770823839524233143896245090018858005831488
+ 5708990770823839524257014136553380871912579276608

# decoded configuration.data for key `0x4200000000000000000000000000000000000006` (symbol: WETH)
@@ configuration.data.borrowCap @@
- 0
+ 19745

@@ `_reserves` key `0x68f180fcce6836688e9084f035309e29bf0a2095`.configuration.data @@
- 5708990770823839524233143914691831279965224835928
+ 5708990770823839524233875314812698130615922072408

# decoded configuration.data for key `0x68f180fcce6836688e9084f035309e29bf0a2095` (symbol: WBTC)
@@ configuration.data.borrowCap @@
- 0
+ 605

```

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_actionsSets` key `"0"`.executed @@
- false
+ true

@@ `_queuedActions` key `0x7ea6def035f56c108570bc9d1a271b5c4da4835c6464cb1f440ae7a97816fc45` @@
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
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x000000000000000000000000350a791bfc2c21f9ed5d10980dad2e2638ffa7f6"],"data":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022a4c"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x00000000000000000000000068f180fcce6836688e9084f035309e29bf0a2095"],"data":"0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000025d"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x0000000000000000000000004200000000000000000000000000000000000006"],"data":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004d21"}}`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 0, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)
  - 0x2e2B1F112C4D79A9D22464F0D345dE9b792705f1: EOA (verification not applicable)
  - 0x158a6bC04F0828318821baE797f50B0A1299d45b: EOA (verification not applicable)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0x280e404338d9d8e50B11D6677B9C91BA86E0FD22: Contract (not verified)
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
0x270d4C1b6F0bB172A9fd628E29530Ca484190013 analyzed (0 contracts with 75 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x794a61358D6845594F94dc1DB02A252b5b4814aD analyzed (0 contracts with 75 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x7d9103572bE58FfE99dc390E8246f02dcAe6f611 analyzed (0 contracts with 75 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation unknown contract name at `0xD6FA681E22306b0F4E605B979b7c9a1dFa865ade`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x8145eddDf43f50276641b55bd3AD95944510021E analyzed (0 contracts with 75 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B analyzed (0 contracts with 75 detectors), 0 result(s) found
```

</details>

<details>
<summary>Slither report for PoolAddressesProvider at `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb analyzed (0 contracts with 75 detectors), 0 result(s) found
```

</details>

</details>
