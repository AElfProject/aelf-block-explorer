import { getConfig, setGlobalConfig } from "aelf-web-login";
import {
  APPNAME,
  CHAIN_ID,
  DEFAUTRPCSERVER,
  NETWORK_TYPE,
  CHAINS_LINK,
  CHAINS_LINK_NAMES,
} from "@config/config";
import isWebview from "../utils/isWebView";

// const graphQLServer =
//   NETWORK_TYPE === "TESTNET"
//     ? "https://dapp-portkey-test.portkey.finance/Portkey_DID"
//     : "https://dapp-portkey.portkey.finance/Portkey_DID";
// const portkeyApiServer =
//   NETWORK_TYPE === "TESTNET"
//     ? "https://did-portkey-test.portkey.finance"
//     : "https://did-portkey.portkey.finance";
// export const connectUrl =
//   NETWORK_TYPE === "TESTNET"
//     ? "https://auth-portkey-test.portkey.finance"
//     : "https://auth-portkey.portkey.finance";

const graphQLServer =
  "http://192.168.67.172:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql";
// !IS_MAINNET
//   ? 'https://dapp-portkey-test.portkey.finance'
//   : 'https://dapp-portkey.portkey.finance';

const portkeyApiServer = "https://localtest-applesign.portkey.finance";
// !IS_MAINNET
// ? 'https://did-portkey-test.portkey.finance'
// : 'https://did-portkey.portkey.finance';

export const connectUrl = "http://192.168.66.240:8080";
const RPC_SERVER =
  "https://localtest-applesign.portkey.finance/api/app/search/chainsinfoindex";
setGlobalConfig({
  appName: APPNAME,
  chainId: CHAIN_ID,
  networkType: NETWORK_TYPE === "TESTNET" ? "TESTNET" : "MAIN",
  portkey: {
    useLocalStorage: true,
    graphQLUrl: `${graphQLServer}/PortKeyIndexerCASchema/graphql`,
    // connectUrl,
    socialLogin: {
      Portkey: isWebview()
        ? undefined
        : {
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
          apiUrl: portkeyApiServer,
          graphQLUrl: `${graphQLServer}/PortKeyIndexerCASchema/graphql`,
          connectUrl,
        },
      ],
    },
  },
  aelfReact: {
    appName: APPNAME,
    nodes: {
      AELF: {
        chainId: "AELF",
        rpcUrl: RPC_SERVER,
      },
      tDVW: {
        chainId: "tDVW",
        rpcUrl: RPC_SERVER,
      },
      tDVV: {
        chainId: "tDVV",
        rpcUrl: RPC_SERVER,
      },
    },
  },
});
