## Optimism

- Simulation: [https://dashboard.tenderly.co/me/simulator/b7d11e71-8008-47aa-b884-52c42455bdc3](https://dashboard.tenderly.co/me/simulator/b7d11e71-8008-47aa-b884-52c42455bdc3)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_queuedActions` key `0x34e55b40f0f94bad2efdeab4ba2d3c32dd30a5f9503b1f55c2116da3d080d607` @@
- true
+ false

@@ `_actionsSets` key `"21"`.executed @@
- false
+ true

```

```diff
# PoolAddressesProvider at `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb`
@@ Slot `0x0d2c1bcee56447b4f46248272f34207a580a5c40f666a31f4e2fbb470ea53ab8` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x000000000000000000000000b1ba0787ca0a45f086f8ca03c97e7593636e47d5"
```

```diff
# AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`
@@ `assetsSources` key `0x1f32b1c2345538c0c6f582fcb022739c4a194ebb` @@
- 0x698b585cbc4407e2d54aa898b2600b53c68958f7
+ 0x05225cd708bca9253789c1374e4337a019e99d56

```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - PoolAddressesProvider at `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb`
    - `PriceOracleSentinelUpdated(oldAddress: 0x0000000000000000000000000000000000000000, newAddress: 0xb1ba0787ca0a45f086f8ca03c97e7593636e47d5)`
  - AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`
    - `AssetSourceUpdated(asset: 0x1f32b1c2345538c0c6f582fcb022739c4a194ebb, source: 0x05225cd708bca9253789c1374e4337a019e99d56)`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 21, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x3105C276558Dd4cf7E7be71d73Be8D33bD18F211: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xd73a92be73efbfcf3854433a5fcbabf9c1316073: EOA (verification not applicable)
  - 0x7d9103572be58ffe99dc390e8246f02dcae6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0x3105c276558dd4cf7e7be71d73be8d33bd18f211: Contract (verified) (AaveV3OptPriceFeedsSentinelUpdate_20230504_Payload)
  - 0xa97684ead0e402dc232d5a977953df7ecbab3cdb: Contract (verified) (PoolAddressesProvider)
  - 0x7a9a9c14b35e58ffa1cc84ab421ace0fdcd289e3: Contract (verified) (AaveV3ConfigEngine)
  - 0x05225cd708bca9253789c1374e4337a019e99d56: Contract (not verified)
  - 0x524299ab0987a7c4b3c8022a35669ddcdc715a10: Contract (not verified)
  - 0x034f1d70092e81b7738459f02f409a5c5c4b8189: Contract (not verified)
  - 0x13e3ee699d1909e989722e753853ae30b17e08c5: Contract (verified) (EACAggregatorProxy)
  - 0x02f5e9e9dcc66ba6392f6904d5fcf8625d9b19c9: Contract (verified) (AccessControlledOffchainAggregator)
  - 0xd81eb3728a631871a7ebbad631b5f424909f0c77: Contract (verified) (AaveOracle)
  - 0xa72636cbcaa8f5ff95b2cc47f3cdee83f3294a0b: Contract (verified) (ACLManager)

#### Runs solc against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>
<details>
<summary>View warnings for AccessControlledOffchainAggregator at `0x02f5E9e9dcc66ba6392f6904D5Fcf8625d9B19C9`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for EACAggregatorProxy at `0x13e3Ee699D1909E989722E753853AE30b17e08c5`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AaveV3OptPriceFeedsSentinelUpdate_20230504_Payload at `0x3105C276558Dd4cf7E7be71d73Be8D33bD18F211`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/crytic-compile", line 5, in <module>
    from crytic_compile.__main__ import main
ModuleNotFoundError: No module named 'crytic_compile'
```

</details>

<details>
<summary>View warnings for AaveV3ConfigEngine at `0x7A9A9c14B35E58ffa1cC84aB421acE0FdcD289E3`</summary>

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
<summary>View warnings for AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`</summary>

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
<summary>Slither report for AccessControlledOffchainAggregator at `0x02f5E9e9dcc66ba6392f6904D5Fcf8625d9B19C9`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for EACAggregatorProxy at `0x13e3Ee699D1909E989722E753853AE30b17e08c5`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AaveV3OptPriceFeedsSentinelUpdate_20230504_Payload at `0x3105C276558Dd4cf7E7be71d73Be8D33bD18F211`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

<details>
<summary>Slither report for AaveV3ConfigEngine at `0x7A9A9c14B35E58ffa1cC84aB421acE0FdcD289E3`</summary>

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
<summary>Slither report for AaveOracle at `0xD81eb3728a631871a7eBBaD631b5f424909f0c77`</summary>

```
Traceback (most recent call last):
  File "/home/sakulstra/.local/bin/slither", line 5, in <module>
    from slither.__main__ import main
ModuleNotFoundError: No module named 'slither'
```

</details>

</details>
