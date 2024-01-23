import ConfiguratorProxy from './configurator-proxy.json'
import FxRoot from './fx-root.json'
import CometProxyAdmin from './comet-proxy-admin.json'
import Unitroller from './unitroller.json'

export interface Abi {
  contractName: string

  abi: any
}
export const abis: { [address: string]: Abi } = {
  '0x316f9708bb98af7da9c68c1c3b5e79039cd336e3': {
    contractName: 'GovernorBravoDelegate',
    abi: ConfiguratorProxy,
  },
  '0x1ec63b5883c3481134fd50d5daebc83ecd2e8779': {
    contractName: 'CometProxyAdmin',
    abi: CometProxyAdmin,
  },

  '0xfe5e5d361b2ad62c541bab87c45a0b9b018389a2': {
    contractName: 'FxRoot',
    abi: FxRoot,
  },

  '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b': {
    contractName: 'Comptroller',
    abi: Unitroller,
  },
}
