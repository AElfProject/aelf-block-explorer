import { getConfig, setGlobalConfig } from "aelf-web-login";
import { did } from '@portkey/did-ui-react';
import {
  APPNAME,
  CHAIN_ID,
  DEFAUTRPCSERVER,
  NETWORK_TYPE,
  CHAINS_LINK,
  CHAINS_LINK_NAMES,
} from "@config/config";

const graphQLServer = NETWORK_TYPE === "TESTNET" ? "https://dapp-portkey-test.portkey.finance" : "https://dapp-portkey.portkey.finance";
const portkeyApiServer = NETWORK_TYPE === "TESTNET" ? "https://did-portkey-test.portkey.finance" : "https://did-portkey.portkey.finance"

// did.config.setConfig

setGlobalConfig({
  appName: APPNAME,
  chainId: CHAIN_ID,
  portkey: {
    useLocalStorage: true,
    graphQLUrl: `${graphQLServer}/Portkey_DID/PortKeyIndexerCASchema/graphql`,
    socialLogin: {
      Portkey: {
        websiteName: APPNAME,
        websiteIcon: `${CHAINS_LINK[CHAIN_ID]}/favicon.main.ico`,
      },
    },
    requestDefaults: {
      timeout: NETWORK_TYPE === "TESTNET" ? 300000 : 80000,
      baseURL: `${portkeyApiServer}`,
    },
    network: {
      defaultNetwork: NETWORK_TYPE,
      networkList: [
        {
          name: CHAINS_LINK_NAMES[CHAIN_ID],
          walletType: "aelf",
          networkType: NETWORK_TYPE,
          isActive: true,
          apiUrl: '',
          graphQLUrl: `${graphQLServer}/Portkey_DID/PortKeyIndexerCASchema/graphql`,
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
      tDVW: {
        chainId: CHAIN_ID,
        rpcUrl: DEFAUTRPCSERVER,
      },
      tDVV: {
        chainId: CHAIN_ID,
        rpcUrl: DEFAUTRPCSERVER,
      },
    },
  },
});
