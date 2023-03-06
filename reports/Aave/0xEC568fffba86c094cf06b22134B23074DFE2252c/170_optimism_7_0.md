## OptimismBridgeExecutor actionSet("7": {"targets":null,"values":null,"signatures":null,"calldatas":null,"withDelegatecalls":null,"executionTime":null,"executed":true,"canceled":false})

_Updated as of block [16770261](https://etherscan.io/block/16770261) at 3/6/2023, 10:40:23 AM ET_

- Simulation: [https://dashboard.tenderly.co/me/simulator/981696b9-8bd0-4bf1-81df-2b9a193b9ab8](https://dashboard.tenderly.co/me/simulator/981696b9-8bd0-4bf1-81df-2b9a193b9ab8)

### Checks

#### Reports all state changes from the proposal ✅ Passed

Info:

- State changes:

```diff
# InitializableImmutableAdminUpgradeabilityProxy at `0x794a61358D6845594F94dc1DB02A252b5b4814aD` with implementation L2Pool at `0x270d4C1b6F0bB172A9fd628E29530Ca484190013`
@@ `_reserves` key `0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6`.configuration.data @@
- 5708990792257640956436458939069038821626354604888
+ 5708990784116119482183852412577533548193756486488

# decoded configuration.data for key `0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6` (symbol: LINK)
@@ configuration.data.borrowCap @@
- 141900
+ 84000
@@ configuration.data.supplyCap @@
- 258000
+ 160000

@@ `_reserves` key `0x68f180fcce6836688e9084f035309e29bf0a2095`.configuration.data @@
- 5708990770915223948944088281074834865752497724248
+ 5708990770875347109070111636221757460587066694488

# decoded configuration.data for key `0x68f180fcce6836688e9084f035309e29bf0a2095` (symbol: WBTC)
@@ configuration.data.borrowCap @@
- 605
+ 250
@@ configuration.data.supplyCap @@
- 1100
+ 620

@@ `_reserves` key `0x76fb31fb4af56892a25e32cfc43de717950c9278`.configuration.data @@
- 5708990779131514497888868083446851843671825060744
+ 5708990774562293262378219770340015073958140580744

# decoded configuration.data for key `0x76fb31fb4af56892a25e32cfc43de717950c9278` (symbol: AAVE)
@@ configuration.data.supplyCap @@
- 100000
+ 45000

@@ `_reserves` key `0x7f5c764cbc14f9669b88837ca1490cca17c31607`.configuration.data @@
- 379853576081034459698860574047498957019910549806912
+ 379853422389047447188855351506270529575686549806912

# decoded configuration.data for key `0x7f5c764cbc14f9669b88837ca1490cca17c31607` (symbol: USDC)
@@ configuration.data.borrowCap @@
- 0
+ 100000000
@@ configuration.data.supplyCap @@
- 2000000000
+ 150000000

@@ `_reserves` key `0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9`.configuration.data @@
- 379853411589069981315521302201372368401379206371184
+ 379853411589069981331237337856362547672559494371184

# decoded configuration.data for key `0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9` (symbol: sUSD)
@@ configuration.data.borrowCap @@
- 0
+ 13000000

@@ `_reserves` key `0x94b008aa00579c1307b0ef2c499ad98a8ce58e58`.configuration.data @@
- 3291009114642412084310318218690782044425170591841207225654237958517038412
+ 3291009114642412084310318218526705463695489381592757375717678223733038412

# decoded configuration.data for key `0x94b008aa00579c1307b0ef2c499ad98a8ce58e58` (symbol: USDT)
@@ configuration.data.borrowCap @@
- 0
+ 16000000
@@ configuration.data.supplyCap @@
- 2000000000
+ 25000000

@@ `_reserves` key `0xda10009cbd5d07dd0cecc66161fc93d7c9000da1`.configuration.data @@
- 379853576081034459698860574047498960397610237566284
+ 379853412004453730017650325597649023837875453566284

# decoded configuration.data for key `0xda10009cbd5d07dd0cecc66161fc93d7c9000da1` (symbol: DAI)
@@ configuration.data.borrowCap @@
- 0
+ 16000000
@@ configuration.data.supplyCap @@
- 2000000000
+ 25000000

```

```diff
# OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
@@ `_actionsSets` key `"7"`.executed @@
- false
+ true

@@ `_queuedActions` key `0xad6ed394d4ae6c365d4e156dd51d20042422ab5f333bfeebf3ae05d02516cfb6` @@
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
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x0263602682188540a2d633561c0b4453b7d8566285e99f9f6018b8ef2facef49","0x000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da1"],"data":"0x000000000000000000000000000000000000000000000000000000007735940000000000000000000000000000000000000000000000000000000000017d7840"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da1"],"data":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x0000000000000000000000008c6f28f2f1a3c87f0f938b96d27520d9751ec8d9"],"data":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c65d40"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x0263602682188540a2d633561c0b4453b7d8566285e99f9f6018b8ef2facef49","0x0000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c31607"],"data":"0x00000000000000000000000000000000000000000000000000000000773594000000000000000000000000000000000000000000000000000000000008f0d180"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x0000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c31607"],"data":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005f5e100"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x0263602682188540a2d633561c0b4453b7d8566285e99f9f6018b8ef2facef49","0x00000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e58"],"data":"0x000000000000000000000000000000000000000000000000000000007735940000000000000000000000000000000000000000000000000000000000017d7840"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x00000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e58"],"data":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f42400"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x0263602682188540a2d633561c0b4453b7d8566285e99f9f6018b8ef2facef49","0x00000000000000000000000076fb31fb4af56892a25e32cfc43de717950c9278"],"data":"0x00000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000000000000000afc8"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x0263602682188540a2d633561c0b4453b7d8566285e99f9f6018b8ef2facef49","0x000000000000000000000000350a791bfc2c21f9ed5d10980dad2e2638ffa7f6"],"data":"0x000000000000000000000000000000000000000000000000000000000003efd00000000000000000000000000000000000000000000000000000000000027100"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x000000000000000000000000350a791bfc2c21f9ed5d10980dad2e2638ffa7f6"],"data":"0x0000000000000000000000000000000000000000000000000000000000022a4c0000000000000000000000000000000000000000000000000000000000014820"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0x0263602682188540a2d633561c0b4453b7d8566285e99f9f6018b8ef2facef49","0x00000000000000000000000068f180fcce6836688e9084f035309e29bf0a2095"],"data":"0x000000000000000000000000000000000000000000000000000000000000044c000000000000000000000000000000000000000000000000000000000000026c"}}`
    - Undecoded log: `{"name":"","anonymous":false,"inputs":null,"raw":{"address":"0x8145edddf43f50276641b55bd3ad95944510021e","topics":["0xc51aca575985d521c5072ad11549bad77013bb786d57f30f94b40ed8f8dc9bc4","0x00000000000000000000000068f180fcce6836688e9084f035309e29bf0a2095"],"data":"0x000000000000000000000000000000000000000000000000000000000000025d00000000000000000000000000000000000000000000000000000000000000fa"}}`
  - OptimismBridgeExecutor at `0x7d9103572bE58FfE99dc390E8246f02dcAe6f611`
    - `ActionsSetExecuted(id: 7, initiatorExecution: 0xd73a92be73efbfcf3854433a5fcbabf9c1316073, returnedData: 0x)`

#### Check all targets are verified on Etherscan ✅ Passed

Info:

- Targets:
  - 0x158a6bC04F0828318821baE797f50B0A1299d45b: EOA (verification not applicable)
  - 0x2e2B1F112C4D79A9D22464F0D345dE9b792705f1: EOA (verification not applicable)
  - 0x5f5C02875a8e9B5A26fbd09040ABCfDeb2AA6711: Contract (not verified)

#### Check all touched contracts are verified on Etherscan ✅ Passed

Info:

- Touched address:
  - 0xD73a92Be73EfbFcF3854433A5FcbAbF9c1316073: EOA (verification not applicable)
  - 0x7d9103572bE58FfE99dc390E8246f02dcAe6f611: Contract (verified) (OptimismBridgeExecutor)
  - 0x3A4F2A6c7E1E641AFAd6300553a0Bb82D6c46a2e: Contract (not verified)
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
0x270d4C1b6F0bB172A9fd628E29530Ca484190013 analyzed (0 contracts with 72 detectors), 0 result(s) found
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

</details>
