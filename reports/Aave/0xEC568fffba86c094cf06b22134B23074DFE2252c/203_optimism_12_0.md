## OptimismBridgeExecutor actionSet("12": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [17066708](https://etherscan.io/block/17066708) at 4/17/2023, 9:11:59 AM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/a8912a54-c60c-4d6f-8180-9d07f3d3f8a0](https://dashboard.tenderly.co/me/simulator/a8912a54-c60c-4d6f-8180-9d07f3d3f8a0)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_actionsSets` key `"12"`.executed @@
- false
+ true

@@ `_queuedActions` key `0x412817c4b7a0860aae4ef6dc4c83c532a8bcb90f19538868c0b5c128cc6d3cef` @@
- true
+ false

```

```diff
# InitializableAdminUpgradeabilityProxy at `0xB2289E329D2F85F1eD31Adbb30eA345278F21bcf`
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000000` @@
- "0x0000000000000000000000000000000000000000000000000000000000000001"
+ "0x0000000000000000000000000000000000000000000000000000000000000005"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000033` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x0000000000000000000000000000000000000000000000000000000000000001"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000034` @@
- "0x000000000000000000000000a77e4a084d7d4f064e326c0f6c0acefd47a5cb21"
+ "0x0000000000000000000000007d9103572be58ffe99dc390e8246f02dcae6f611"
@@ Slot `0x0000000000000000000000000000000000000000000000000000000000000035` @@
- "0x0000000000000000000000000000000000000000000000000000000000000000"
+ "0x00000000000000000000000000000000000000000000000000000000000186a0"
@@ Slot `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` @@
- "0x000000000000000000000000a6a7b56f27c9c943945e8a636c01e433240700d8"
+ "0x000000000000000000000000230e0321cf38f09e247e50afc7801ea2351fe56f"
@@ Slot `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103` @@
- "0x0000000000000000000000007d9103572be58ffe99dc390e8246f02dcae6f611"
+ "0x000000000000000000000000d3cf979e676265e4f6379749dece4708b9a22476"
```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - InitializableAdminUpgradeabilityProxy at `0xB2289E329D2F85F1eD31Adbb30eA345278F21bcf`
    - `Upgraded(implementation: 0x230e0321cf38f09e247e50afc7801ea2351fe56f)`
    - `NewFundsAdmin(fundsAdmin: 0x7d9103572be58ffe99dc390e8246f02dcae6f611)`
    - `AdminChanged(previousAdmin: 0x7d9103572be58ffe99dc390e8246f02dcae6f611, newAdmin: 0xd3cf979e676265e4f6379749dece4708b9a22476)`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 12, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x7fc3FCb14eF04A48Bb0c12f0c39CD74C249c37d8: EOA (verification not applicable)
  - 0x158a6bC04F0828318821baE797f50B0A1299d45b: EOA (verification not applicable)
  - 0x2e2B1F112C4D79A9D22464F0D345dE9b792705f1: EOA (verification not applicable)
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0xA9F30e6ED4098e9439B2ac8aEA2d3fc26BcEbb45: Contract (verified) (UpgradeAaveCollectorPayload)
  - 0xB2289E329D2F85F1eD31Adbb30eA345278F21bcf: Contract (verified) (InitializableAdminUpgradeabilityProxy)
  - 0x230E0321Cf38F09e247e50Afc7801EA2351fe56F: Contract (verified) (Collector)

#### Runs solc against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>
<details>
<summary>View warnings for OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for InitializableAdminUpgradeabilityProxy at `0xB2289E329D2F85F1eD31Adbb30eA345278F21bcf`</summary>

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
<summary>Slither report for Collector at `0x230E0321Cf38F09e247e50Afc7801EA2351fe56F`</summary>

```
INFO:Detectors:
Variable CLSynchronicityPriceAdapterPegToBase.PEG_TO_BASE (src/contracts/CLSynchronicityPriceAdapterPegToBase.sol#19) is not in mixedCase
Variable CLSynchronicityPriceAdapterPegToBase.ASSET_TO_PEG (src/contracts/CLSynchronicityPriceAdapterPegToBase.sol#24) is not in mixedCase
Variable CLSynchronicityPriceAdapterPegToBase.DECIMALS (src/contracts/CLSynchronicityPriceAdapterPegToBase.sol#29) is not in mixedCase
Variable CLSynchronicityPriceAdapterPegToBase.DENOMINATOR (src/contracts/CLSynchronicityPriceAdapterPegToBase.sol#35) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions
INFO:Slither:0x230E0321Cf38F09e247e50Afc7801EA2351fe56F analyzed (3 contracts with 79 detectors), 4 result(s) found
```

</details>

<details>
<summary>Slither report for OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

<details>
<summary>Slither report for UpgradeAaveCollectorPayload at `0xA9F30e6ED4098e9439B2ac8aEA2d3fc26BcEbb45`</summary>

```
INFO:Detectors:
Variable CLSynchronicityPriceAdapterPegToBase.PEG_TO_BASE (src/contracts/CLSynchronicityPriceAdapterPegToBase.sol#19) is not in mixedCase
Variable CLSynchronicityPriceAdapterPegToBase.ASSET_TO_PEG (src/contracts/CLSynchronicityPriceAdapterPegToBase.sol#24) is not in mixedCase
Variable CLSynchronicityPriceAdapterPegToBase.DECIMALS (src/contracts/CLSynchronicityPriceAdapterPegToBase.sol#29) is not in mixedCase
Variable CLSynchronicityPriceAdapterPegToBase.DENOMINATOR (src/contracts/CLSynchronicityPriceAdapterPegToBase.sol#35) is not in mixedCase
Variable CLwstETHSynchronicityPriceAdapter.STETH (src/contracts/CLwstETHSynchronicityPriceAdapter.sol#21) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions
INFO:Slither:0xA9F30e6ED4098e9439B2ac8aEA2d3fc26BcEbb45 analyzed (5 contracts with 79 detectors), 5 result(s) found
```

</details>

<details>
<summary>Slither report for InitializableAdminUpgradeabilityProxy at `0xB2289E329D2F85F1eD31Adbb30eA345278F21bcf`</summary>

```
Source code not available, try to fetch the bytecode only
Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'
ERROR:root:Error in 0xB2289E329D2F85F1eD31Adbb30eA345278F21bcf
ERROR:root:Traceback (most recent call last):
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 837, in main_impl
    ) = process_all(filename, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 101, in process_all
    ) = process_single(compilation, args, detector_classes, printer_classes)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/__main__.py", line 79, in process_single
    slither = Slither(target, ast_format=ast, **vars(args))
  File "/home/runner/.local/lib/python3.10/site-packages/slither/slither.py", line 114, in __init__
    parser.parse_top_level_from_loaded_json(ast, path)
  File "/home/runner/.local/lib/python3.10/site-packages/slither/solc_parsing/slither_compilation_unit_solc.py", line 205, in parse_top_level_from_loaded_json
    if data_loaded[self.get_key()] == "root":
KeyError: 'name'

```

</details>

</details>
