## OptimismBridgeExecutor actionSet("18": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [17349982](https://etherscan.io/block/17349982) at 5/27/2023, 7:05:59 AM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/a2ff38b4-3213-479f-bbdb-b0ec121b20f1](https://dashboard.tenderly.co/me/simulator/a2ff38b4-3213-479f-bbdb-b0ec121b20f1)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x764594F8e9757edE877B75716f8077162B251460`
@@ `_eModeCategories` key `1`.ltv @@
- 9700
+ 9300
@@ `_eModeCategories` key `1`.liquidationThreshold @@
- 9750
+ 9500

```

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_queuedActions` key `0x47a385c55e2832e7cf61fb0f8120a07bf88596f91a0f1e08ed49f06016dfb318` @@
- true
+ false

@@ `_actionsSets` key `"18"`.executed @@
- false
+ true

```

#### Check stack trace of the proposal ✅ Passed

Info:

- There is no SELFDESTRUCT inside of delegated call

#### Reports all events emitted from the proposal ✅ Passed

Info:

- Events Emitted:
  - InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation PoolConfigurator at `0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B`
    - `EModeCategoryAdded(categoryId: 1, ltv: 9300, liquidationThreshold: 9500, liquidationBonus: 10100, oracle: 0x0000000000000000000000000000000000000000, label: Stablecoins)`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 18, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0xd1B3E25fD7C8AE7CADDC6F71b461b79CD4ddcFa3: Contract (not verified)
  - 0x158a6bC04F0828318821baE797f50B0A1299d45b: EOA (verification not applicable)
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0xF22c8255eA615b3Da6CA5CF5aeCc8956bfF07Aa8: Contract (verified) (AaveV3OptimismUpdate20230502Payload)
  - 0x7A9A9c14B35E58ffa1cC84aB421acE0FdcD289E3: Contract (verified) (AaveV3ConfigEngine)
  - 0x794a61358D6845594F94dc1DB02A252b5b4814aD: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0x764594F8e9757edE877B75716f8077162B251460: Contract (verified) (L2Pool)
  - 0x8145eddDf43f50276641b55bd3AD95944510021E: Contract (verified) (InitializableImmutableAdminUpgradeabilityProxy)
  - 0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B: Contract (verified) (PoolConfigurator)
  - 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb: Contract (verified) (PoolAddressesProvider)
  - 0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B: Contract (verified) (ACLManager)

#### Runs solc against the verified contracts ✅ Passed

Info:

-

<details>
<summary>View Details</summary>
<details>
<summary>View warnings for PoolConfigurator at `0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for L2Pool at `0x764594F8e9757edE877B75716f8077162B251460`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x764594F8e9757edE877B75716f8077162B251460`</summary>

```
INFO:CryticCompile:Source code not available, try to fetch the bytecode only
```

</details>

<details>
<summary>View warnings for AaveV3ConfigEngine at `0x7A9A9c14B35E58ffa1cC84aB421acE0FdcD289E3`</summary>

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
<summary>View warnings for InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation PoolConfigurator at `0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B`</summary>

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
<summary>Slither report for PoolConfigurator at `0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B`</summary>

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
ERROR:root:Error in 0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B
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
<summary>Slither report for L2Pool at `0x764594F8e9757edE877B75716f8077162B251460`</summary>

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
ERROR:root:Error in 0x764594F8e9757edE877B75716f8077162B251460
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
<summary>Slither report for InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x764594F8e9757edE877B75716f8077162B251460`</summary>

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
ERROR:root:Error in 0x794a61358D6845594F94dc1DB02A252b5b4814aD
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
<summary>Slither report for AaveV3ConfigEngine at `0x7A9A9c14B35E58ffa1cC84aB421acE0FdcD289E3`</summary>

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
ERROR:root:Error in 0x7A9A9c14B35E58ffa1cC84aB421acE0FdcD289E3
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
<summary>Slither report for InitializableImmutableAdminUpgradeabilityProxy at `0x8145eddDf43f50276641b55bd3AD95944510021E` with implementation PoolConfigurator at `0x29081f7aB5a644716EfcDC10D5c926c5fEe9F72B`</summary>

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
ERROR:root:Error in 0x8145eddDf43f50276641b55bd3AD95944510021E
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
<summary>Slither report for ACLManager at `0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B`</summary>

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
ERROR:root:Error in 0xa72636CbcAa8F5FF95B2cc47F3CDEe83F3294a0B
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
<summary>Slither report for PoolAddressesProvider at `0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb`</summary>

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
ERROR:root:Error in 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb
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
<summary>Slither report for AaveV3OptimismUpdate20230502Payload at `0xF22c8255eA615b3Da6CA5CF5aeCc8956bfF07Aa8`</summary>

```
INFO:Detectors:
DefaultReserveInterestRateStrategy.calculateInterestRates(address,uint256,uint256,uint256,uint256,uint256).vars (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#134) is a local variable never initialized
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-local-variables
INFO:Detectors:
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
INFO:Detectors:
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
INFO:Detectors:
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
INFO:Detectors:
Variable DefaultReserveInterestRateStrategy._stableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#51) is too similar to DefaultReserveInterestRateStrategy._stableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#54)
Variable DefaultReserveInterestRateStrategy._variableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#45) is too similar to DefaultReserveInterestRateStrategy._variableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#48)
Variable DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).stableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#62) is too similar to DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).stableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#63)
Variable DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).variableRateSlope1 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#60) is too similar to DefaultReserveInterestRateStrategy.constructor(ILendingPoolAddressesProvider,uint256,uint256,uint256,uint256,uint256,uint256).variableRateSlope2 (@aave/protocol-v2/contracts/protocol/lendingpool/DefaultReserveInterestRateStrategy.sol#61)
Variable Errors.LP_INCONSISTENT_FLASHLOAN_PARAMS (@aave/protocol-v2/contracts/protocol/libraries/helpers/Errors.sol#55) is too similar to Errors.VL_INCONSISTENT_FLASHLOAN_PARAMS (@aave/protocol-v2/contracts/protocol/libraries/helpers/Errors.sol#100)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#variable-names-too-similar
INFO:Slither:0xF22c8255eA615b3Da6CA5CF5aeCc8956bfF07Aa8 analyzed (8 contracts with 79 detectors), 32 result(s) found
```

</details>

</details>
