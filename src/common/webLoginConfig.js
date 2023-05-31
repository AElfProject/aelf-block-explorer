import { getConfig, setGlobalConfig } from 'aelf-web-login';
import { APPNAME, CHAIN_ID, DEFAUTRPCSERVER } from "@config/config";

const IS_MAINNET = false;
setGlobalConfig({
  appName: APPNAME,
  chainId: CHAIN_ID,
  portkey: {
    useLocalStorage: true,
    graphQLUrl: '/Portkey_DID/PortKeyIndexerCASchema',
    socialLogin: {
      Portkey: {
        websiteName: 'explorer.aelf.io',
        websiteIcon: 'https://explorer.aelf.io/favicon.main.ico',
      },
    },
    requestDefaults: {
      baseURL: '/portkey'
    },
    network: {
      defaultNetwork: IS_MAINNET ? 'MAIN' : 'TESTNET',
      networkList: [
        {
          name: 'aelf MAIN',
          walletType: 'aelf',
          networkType: IS_MAINNET ? 'MAIN' : 'TESTNET',
          isActive: true,
          apiUrl: '',
          graphQLUrl: '/Portkey_DID/PortKeyIndexerCASchema',
          connectUrl: '',
        },
      ],
    },
  },
  aelfReact: {
    appName: APPNAME,
    nodes: {
      AELF: {
        chainId: CHAIN_ID,
        rpcUrl: DEFAUTRPCSERVER,
      },
    }
  },
});

console.log(getConfig());
