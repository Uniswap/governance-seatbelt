## Polygon

- Simulation: [https://dashboard.tenderly.co/me/simulator/a1227adc-3031-4e96-b8b5-1fe732436890](https://dashboard.tenderly.co/me/simulator/a1227adc-3031-4e96-b8b5-1fe732436890)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# KeeperRegistry at `0x02777053d6764996e594c3E88AF1D58D5363a2e6`
@@ `s_upkeep` key `"59004534399919487726050348266959936260154145654847903814887020424644065605379"`.lastKeeper @@
- 0xa7d87d93fc879c5ec959ebdc4a058bc906be42ec
+ 0x71dd101432fd1041dfd7b718b1c0adeb1ce13d60

```

```diff
# ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`
@@ `_roles` key `0x8aa855a911518ecfbe5bc3088c8f3dda7badf130faaf8ace33fdc33828e18167`.members.0xc5de989e0d1bf605d19478fdd32aa827a10b464f @@
- false
+ true

```

```diff
# PolygonBridgeExecutor at `0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772`
@@ `_actionsSets` key `"44"`.executed @@
- false
+ true

@@ `_queuedActions` key `0x7df8e06ab993b104a2a831ad8a8adc4b83db435a06b43a56fbaa2b8c2191b32d` @@
- true
+ false

```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`
    - `RoleGranted(role: 0x8aa855a911518ecfbe5bc3088c8f3dda7badf130faaf8ace33fdc33828e18167, account: 0xc5de989e0d1bf605d19478fdd32aa827a10b464f, sender: 0xdc9a35b16db4e126cfedc41322b3a36454b1f772)`
  - PolygonBridgeExecutor at `0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772`
    - `ActionsSetExecuted(id: 44, initiatorExecution: 0x7d0219c7037819b3f5d73e235c595189c3f8c224, returnedData: 0x)`
  - KeeperRegistry at `0x02777053d6764996e594c3E88AF1D58D5363a2e6`
    - `UpkeepPerformed(id: 59004534399919487726050348266959936260154145654847903814887020424644065605379, success: true, from: 0x71dd101432fd1041dfd7b718b1c0adeb1ce13d60, payment: 0, performData: 0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002c)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x4C0633Bf70fB2bB984A9eEC5d9052BdEA451C70A: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0x71dd101432fd1041dfd7b718b1c0adeb1ce13d60: EOA (verification not applicable)
  - 0x02777053d6764996e594c3e88af1d58d5363a2e6: Contract (verified) (KeeperRegistry)
  - 0xf824ea79774e8698e6c6d156c60ab054794c9b18: Contract (verified) (EACAggregatorProxy)
  - 0x828a123d84e1aecf6d604048a4beaabe14fb0e39: Contract (verified) (AccessControlledOffchainAggregator)
  - 0x5787befdc0ecd210dfa948264631cd53e68f7802: Contract (verified) (EACAggregatorProxy)
  - 0x817c00afc51e6574acaa718336fb4414ebc87fdb: Contract (verified) (AccessControlledOffchainAggregator)
  - 0x7d0219c7037819b3f5d73e235c595189c3f8c224: Contract (verified) (L2RobotKeeper)
  - 0xdc9a35b16db4e126cfedc41322b3a36454b1f772: Contract (verified) (PolygonBridgeExecutor)
  - 0x4c0633bf70fb2bb984a9eec5d9052bdea451c70a: Contract (verified) (AaveV3RiskSteward_20230404)
  - 0xa72636cbcaa8f5ff95b2cc47f3cdee83f3294a0b: Contract (verified) (ACLManager)

#### Runs solc against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>
<details>
<summary>View warnings for KeeperRegistry at `0x02777053d6764996e594c3E88AF1D58D5363a2e6`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AaveV3RiskSteward_20230404 at `0x4C0633Bf70fB2bB984A9eEC5d9052BdEA451C70A`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for EACAggregatorProxy at `0x5787BefDc0ECd210Dfa948264631CD53E68F7802`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for L2RobotKeeper at `0x7D0219C7037819B3F5d73E235C595189C3F8c224`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AccessControlledOffchainAggregator at `0x817C00aFc51e6574ACaA718336FB4414eBC87Fdb`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AccessControlledOffchainAggregator at `0x828a123D84E1aecF6d604048A4BeaAbe14FB0e39`</summary>

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
<summary>View warnings for PolygonBridgeExecutor at `0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for EACAggregatorProxy at `0xf824eA79774E8698E6C6D156c60ab054794C9B18`</summary>

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
<summary>Slither report for KeeperRegistry at `0x02777053d6764996e594c3E88AF1D58D5363a2e6`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AaveV3RiskSteward_20230404 at `0x4C0633Bf70fB2bB984A9eEC5d9052BdEA451C70A`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for EACAggregatorProxy at `0x5787BefDc0ECd210Dfa948264631CD53E68F7802`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for L2RobotKeeper at `0x7D0219C7037819B3F5d73E235C595189C3F8c224`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AccessControlledOffchainAggregator at `0x817C00aFc51e6574ACaA718336FB4414eBC87Fdb`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AccessControlledOffchainAggregator at `0x828a123D84E1aecF6d604048A4BeaAbe14FB0e39`</summary>

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
<summary>Slither report for PolygonBridgeExecutor at `0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for EACAggregatorProxy at `0xf824eA79774E8698E6C6D156c60ab054794C9B18`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

</details>
