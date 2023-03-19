## OptimismBridgeExecutor actionSet("8": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [16863790](https://etherscan.io/block/16863790) at 3/19/2023, 3:19:23 PM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/d4ba80e7-78a2-41de-96a2-2c19a3817563](https://dashboard.tenderly.co/me/simulator/d4ba80e7-78a2-41de-96a2-2c19a3817563)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# EmissionManager at `0x048f2228D7Bf6776f99aB50cB1b1eaB4D1d4cA73`
@@ `_emissionAdmins` key `0x4200000000000000000000000000000000000042` @@
- 0x2501c477d0a35545a387aa4a3eee4292a9a8b3f0
+ 0x5033823f27c5f977707b58f0351adcd732c955dd

```

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_queuedActions` key `0xe79ab0e57b0893a0c0f9851e2eb2320e934bd8288cb4e1a45309c57f920b9ec7` @@
- true
+ false

@@ `_actionsSets` key `"8"`.executed @@
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
    - `EmissionAdminUpdated(reward: 0x4200000000000000000000000000000000000042, oldAdmin: 0x2501c477d0a35545a387aa4a3eee4292a9a8b3f0, newAdmin: 0x5033823f27c5f977707b58f0351adcd732c955dd)`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 8, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0x4b8D3277d49E114C8F2D6E0B2eD310e29226fe16: Contract (not verified)
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
