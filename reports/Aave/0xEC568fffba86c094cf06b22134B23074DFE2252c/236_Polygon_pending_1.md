## Polygon

- Simulation: [https://dashboard.tenderly.co/me/simulator/8eb41a22-b38f-4792-8c67-2abd82245b12](https://dashboard.tenderly.co/me/simulator/8eb41a22-b38f-4792-8c67-2abd82245b12)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# AaveOracle at `0xb023e699F5a33916Ea823A16485e259257cA8Bd1`
@@ `assetsSources` key `0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4` @@
- 0x97371df4492605486e23da797fa68e55fc38a13f
+ 0xee96b77129cf54581b5a8fecccc50a6a067034a1

@@ `assetsSources` key `0xfa68fb4628dff1028cfec22b4162fccd0d45efb6` @@
- 0x5d37e4b374e6907de8fc7fb33ee3b0af403c7403
+ 0x0e1120524e14bd7ad96ea76a1b1dd699913e2a45

```

```diff
# PolygonBridgeExecutor at `0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772`
@@ `_actionsSets` key `"45"`.executed @@
- false
+ true

@@ `_queuedActions` key `0x292868c5fef9e98982095c4de7055a5e25fad215ee2c9a2e0e928a97391dd5f7` @@
- true
+ false

```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - AaveOracle at `0xb023e699F5a33916Ea823A16485e259257cA8Bd1`
    - `AssetSourceUpdated(asset: 0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4, source: 0xee96b77129cf54581b5a8fecccc50a6a067034a1)`
    - `AssetSourceUpdated(asset: 0xfa68fb4628dff1028cfec22b4162fccd0d45efb6, source: 0x0e1120524e14bd7ad96ea76a1b1dd699913e2a45)`
  - PolygonBridgeExecutor at `0xdc9A35B16DB4e126cFeDC41322b3a36454B1F772`
    - `ActionsSetExecuted(id: 45, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x6acCc155626E0CF8bFe97e68A17a567394D51238: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xd73a92be73efbfcf3854433a5fcbabf9c1316073: EOA (verification not applicable)
  - 0xdc9a35b16db4e126cfedc41322b3a36454b1f772: Contract (verified) (PolygonBridgeExecutor)
  - 0x6accc155626e0cf8bfe97e68a17a567394d51238: Contract (verified) (AaveV3PolPriceFeedsUpdate_20230504_Payload)
  - 0xe202f2fc4b6a37ba53cfd15be42a762a645fca07: Contract (verified) (AaveV3ConfigEngine)
  - 0xee96b77129cf54581b5a8fecccc50a6a067034a1: Contract (verified) (MaticSynchronicityPriceAdapter)
  - 0xab594600376ec9fd91f8e885dadf0ce036862de0: Contract (verified) (EACAggregatorProxy)
  - 0x1278c74c3b2f8c3bca0089b4e128faf023615ecf: Contract (verified) (AccessControlledOffchainAggregator)
  - 0xded6c522d803e35f65318a9a4d7333a22d582199: Contract (verified) (RateProvider)
  - 0x0833f5bd45803e05ef54e119a77e463ce6b1a963: Contract (verified) (FxStateChildTunnel)
  - 0x0e1120524e14bd7ad96ea76a1b1dd699913e2a45: Contract (verified) (MaticSynchronicityPriceAdapter)
  - 0xee652bbf72689aa59f0b8f981c9c90e2a8af8d8f: Contract (verified) (RateProvider)
  - 0x97e58a6950d86d751082d5e1d350e74c19047570: Contract (verified) (FxStateChildTunnel)
  - 0xb023e699f5a33916ea823a16485e259257ca8bd1: Contract (verified) (AaveOracle)
  - 0xa97684ead0e402dc232d5a977953df7ecbab3cdb: Contract (verified) (PoolAddressesProvider)
  - 0xa72636cbcaa8f5ff95b2cc47f3cdee83f3294a0b: Contract (verified) (ACLManager)

#### Runs solc against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>
<details>
<summary>View warnings for FxStateChildTunnel at `0x0833f5bD45803E05ef54E119a77E463cE6b1a963`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for MaticSynchronicityPriceAdapter at `0x0e1120524e14Bd7aD96Ea76A1b1dD699913e2a45`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AccessControlledOffchainAggregator at `0x1278C74c3B2f8c3BcA0089b4E128fAf023615ECf`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AaveV3PolPriceFeedsUpdate_20230504_Payload at `0x6acCc155626E0CF8bFe97e68A17a567394D51238`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for FxStateChildTunnel at `0x97E58a6950D86d751082D5e1d350e74c19047570`</summary>

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
<summary>View warnings for PoolAddressesProvider at `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for EACAggregatorProxy at `0xAB594600376Ec9fD91F8e885dADF0CE036862dE0`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AaveOracle at `0xb023e699F5a33916Ea823A16485e259257cA8Bd1`</summary>

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
<summary>View warnings for RateProvider at `0xdEd6C522d803E35f65318a9a4d7333a22d582199`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AaveV3ConfigEngine at `0xE202F2fc4b6A37Ba53cfD15bE42a762A645FCA07`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for RateProvider at `0xeE652bbF72689AA59F0B8F981c9c90e2A8Af8d8f`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for MaticSynchronicityPriceAdapter at `0xEe96b77129cF54581B5a8FECCcC50A6A067034a1`</summary>

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
<summary>Slither report for FxStateChildTunnel at `0x0833f5bD45803E05ef54E119a77E463cE6b1a963`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for MaticSynchronicityPriceAdapter at `0x0e1120524e14Bd7aD96Ea76A1b1dD699913e2a45`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AccessControlledOffchainAggregator at `0x1278C74c3B2f8c3BcA0089b4E128fAf023615ECf`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AaveV3PolPriceFeedsUpdate_20230504_Payload at `0x6acCc155626E0CF8bFe97e68A17a567394D51238`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for FxStateChildTunnel at `0x97E58a6950D86d751082D5e1d350e74c19047570`</summary>

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
<summary>Slither report for PoolAddressesProvider at `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for EACAggregatorProxy at `0xAB594600376Ec9fD91F8e885dADF0CE036862dE0`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AaveOracle at `0xb023e699F5a33916Ea823A16485e259257cA8Bd1`</summary>

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
<summary>Slither report for RateProvider at `0xdEd6C522d803E35f65318a9a4d7333a22d582199`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AaveV3ConfigEngine at `0xE202F2fc4b6A37Ba53cfD15bE42a762A645FCA07`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for RateProvider at `0xeE652bbF72689AA59F0B8F981c9c90e2A8Af8d8f`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for MaticSynchronicityPriceAdapter at `0xEe96b77129cF54581B5a8FECCcC50A6A067034a1`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

</details>
