## OptimismBridgeExecutor actionSet("5": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [16684141](https://etherscan.io/block/16684141) at 2/22/2023, 8:00:11 AM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/e2f20073-0e35-4bcb-a5cf-535cc108af5c](https://dashboard.tenderly.co/me/simulator/e2f20073-0e35-4bcb-a5cf-535cc108af5c)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# EmissionManager at `0x048f2228D7Bf6776f99aB50cB1b1eaB4D1d4cA73`
@@ `_emissionAdmins` key `0xfdb794692724153d1488ccdbe0c56c252596735f` @@
- 0x0000000000000000000000000000000000000000
+ 0x5033823f27c5f977707b58f0351adcd732c955dd

```

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_queuedActions` key `0xf6c97c48e591a14996f21107722fdd76a80d6eecb801035f570a95979801d858` @@
- true
+ false

@@ `_actionsSets` key `"5"`.executed @@
- false
+ true

```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - EmissionManager at `0x048f2228D7Bf6776f99aB50cB1b1eaB4D1d4cA73`
    - `EmissionAdminUpdated(reward: 0xfdb794692724153d1488ccdbe0c56c252596735f, oldAdmin: 0x0000000000000000000000000000000000000000, newAdmin: 0x5033823f27c5f977707b58f0351adcd732c955dd)`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 5, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x26366920975b24A89CD991A495d0D70CB8E1BA1F: EOA (verification not applicable)
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)
  - 0x2e2B1F112C4D79A9D22464F0D345dE9b792705f1: EOA (verification not applicable)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0x2Cbf7856f51660Aae066afAbaBf9C854FA6BD11f: Contract (not verified)
  - 0x048f2228D7Bf6776f99aB50cB1b1eaB4D1d4cA73: Contract (verified) (EmissionManager)

#### Runs solc against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>
<details>
<summary>View warnings for EmissionManager at `0x048f2228D7Bf6776f99aB50cB1b1eaB4D1d4cA73`</summary>

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

</details>

#### Runs slither against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>

<details>
<summary>Slither report for EmissionManager at `0x048f2228D7Bf6776f99aB50cB1b1eaB4D1d4cA73`</summary>

```
Source code not available, try to fetch the bytecode only
No contract were found in None, check the correct compilation
No contract was analyzed
0x048f2228D7Bf6776f99aB50cB1b1eaB4D1d4cA73 analyzed (0 contracts with 72 detectors), 0 result(s) found
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

</details>
