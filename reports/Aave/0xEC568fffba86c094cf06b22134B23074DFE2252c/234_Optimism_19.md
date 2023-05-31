## Optimism

- Simulation: [https://dashboard.tenderly.co/me/simulator/b5b43b26-5b15-4745-9fa0-0a8103cf31ee](https://dashboard.tenderly.co/me/simulator/b5b43b26-5b15-4745-9fa0-0a8103cf31ee)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# KeeperRegistry1_3 at `0x75c0530885F385721fddA23C539AF3701d6183D4`
@@ `s_upkeep` key `"2644198306353233154445573060213895807978508598208963942704092322563145107595"`.balance @@
- 17009455982348540619
+ 16978197728232027819
@@ `s_upkeep` key `"2644198306353233154445573060213895807978508598208963942704092322563145107595"`.lastKeeper @@
- 0xa7f0ccf1d96626baa7e96d8a14a7dc9951412a8d
+ 0xa6101ebd36c861f9da6b3b8f1974882a2faa0830
@@ `s_upkeep` key `"2644198306353233154445573060213895807978508598208963942704092322563145107595"`.amountSpent @@
- 392709878757379381
+ null
@@ `s_upkeep` key `"2644198306353233154445573060213895807978508598208963942704092322563145107595"`.admin @@
- 0xe3fd707583932a99513a5c65c8463de769f5dadf
+ 0x0000000000000000000000000000000000000000

@@ `s_keeperInfo` key `0xa6101ebd36c861f9da6b3b8f1974882a2faa0830`.balance @@
- 50181862692299155814
+ 50213120946415668614

```

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_queuedActions` key `0x7bfc2294a4fabb310c4ed9872288eb0c965761434e56e53f95248f23aa207b71` @@
- true
+ false

@@ `_actionsSets` key `"19"`.executed @@
- false
+ true

```

```diff
# ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`
@@ `_roles` key `0x8aa855a911518ecfbe5bc3088c8f3dda7badf130faaf8ace33fdc33828e18167`.members.0x5e76e98e0963ecdc6a065d1435f84065b7523f39 @@
- false
+ true

```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`
    - `RoleGranted(role: 0x8aa855a911518ecfbe5bc3088c8f3dda7badf130faaf8ace33fdc33828e18167, account: 0x5e76e98e0963ecdc6a065d1435f84065b7523f39, sender: 0x7d9103572be58ffe99dc390e8246f02dcae6f611)`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 19, initiatorExecution: 0x943acd0c93d7a8bee7da5fd0dc3d0028237074d6, returnedData: 0x)`
  - KeeperRegistry1_3 at `0x75c0530885F385721fddA23C539AF3701d6183D4`
    - `UpkeepPerformed(id: 2644198306353233154445573060213895807978508598208963942704092322563145107595, success: true, from: 0xa6101ebd36c861f9da6b3b8f1974882a2faa0830, payment: 31258254116512800, performData: 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000013)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0xA3e44d830440dF5098520F62Ebec285B1198c51E: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xa6101ebd36c861f9da6b3b8f1974882a2faa0830: EOA (verification not applicable)
  - 0x75c0530885f385721fdda23c539af3701d6183d4: Contract (verified) (KeeperRegistry1_3)
  - 0xe9b80c60a2333dca98c483a8a1efafaf17c5d4ac: Contract (not verified)
  - 0x1c9213dcc6762efdff500a2d3f8df4508b37636a: Contract (verified) (AccessControlledOffchainAggregator)
  - 0x464a1515adc20de946f8d0deb99cead8ceae310d: Contract (not verified)
  - 0xe67a10da53fcd59fae7e47f155c290cb5defb4b0: Contract (verified) (AccessControlledOffchainAggregator)
  - 0x420000000000000000000000000000000000000f: Contract (verified) (OVM_GasPriceOracle)
  - 0x943acd0c93d7a8bee7da5fd0dc3d0028237074d6: Contract (verified) (L2RobotKeeper)
  - 0x7d9103572be58ffe99dc390e8246f02dcae6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0xa3e44d830440df5098520f62ebec285b1198c51e: Contract (verified) (AaveV3RiskSteward_20230404)
  - 0xa72636cbcaa8f5ff95b2cc47f3cdee83f3294a0b: Contract (verified) (ACLManager)

#### Runs solc against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>
<details>
<summary>View warnings for AccessControlledOffchainAggregator at `0x1C9213DCC6762EfdFf500a2d3f8Df4508B37636a`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for OVM_GasPriceOracle at `0x420000000000000000000000000000000000000F`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for KeeperRegistry1_3 at `0x75c0530885F385721fddA23C539AF3701d6183D4`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for L2RobotKeeper at `0x943AcD0c93d7a8Bee7dA5Fd0DC3d0028237074d6`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AaveV3RiskSteward_20230404 at `0xA3e44d830440dF5098520F62Ebec285B1198c51E`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AccessControlledOffchainAggregator at `0xE67a10DA53Fcd59fae7e47F155c290cb5Defb4B0`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

</details>

#### Runs slither against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>

<details>
<summary>Slither report for AccessControlledOffchainAggregator at `0x1C9213DCC6762EfdFf500a2d3f8Df4508B37636a`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for OVM_GasPriceOracle at `0x420000000000000000000000000000000000000F`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for KeeperRegistry1_3 at `0x75c0530885F385721fddA23C539AF3701d6183D4`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for L2RobotKeeper at `0x943AcD0c93d7a8Bee7dA5Fd0DC3d0028237074d6`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AaveV3RiskSteward_20230404 at `0xA3e44d830440dF5098520F62Ebec285B1198c51E`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AccessControlledOffchainAggregator at `0xE67a10DA53Fcd59fae7e47F155c290cb5Defb4B0`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

</details>
