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

const graphQLUrl = {
  v1:
    NETWORK_TYPE === "TESTNET"
      ? "https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql"
      : "https://dapp-portkey.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql",
  v2:
    NETWORK_TYPE === "TESTNET"
      ? "https://dapp-aa-portkey-test.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql"
      : "https://dapp-aa-portkey.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql",
};

const connectUrl = {
  v1:
    NETWORK_TYPE === "TESTNET"
      ? "https://auth-portkey-test.portkey.finance"
      : "https://auth-portkey.portkey.finance",
  v2:
    NETWORK_TYPE === "TESTNET"
      ? "https://auth-aa-portkey-test.portkey.finance"
      : "https://auth-aa-portkey.portkey.finance",
};
const serviceUrl = {
  v1:
    NETWORK_TYPE === "TESTNET"
      ? "https://did-portkey-test.portkey.finance"
      : "https://aa-portkey-test.portkey.finance",
  v2:
    NETWORK_TYPE === "TESTNET"
      ? "https://did-portkey.portkey.finance"
      : "https://aa-portkey.portkey.finance",
};

setGlobalConfig({
  appName: APPNAME,
  chainId: CHAIN_ID,
  networkType: NETWORK_TYPE === "TESTNET" ? "TESTNET" : "MAIN",
  portkey: {
    useLocalStorage: true,
    graphQLUrl: graphQLUrl.v1,
    connectUrl: connectUrl.v1,
    loginConfig: {
      loginMethodsOrder: [
        "Email",
        "Telegram",
        "Google",
        "Phone",
        "Apple",
        "Scan",
      ],
      recommendIndexes: [0, 1],
    },
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
      baseURL: "/v1",
    },
    serviceUrl: serviceUrl.v1,
  },
  portkeyV2: {
    networkType: NETWORK_TYPE === "TESTNET" ? "TESTNET" : "MAINNET",
    graphQLUrl: graphQLUrl.v2,
    connectUrl: connectUrl.v2,
    requestDefaults: {
      baseURL: "/v2",
      timeout: NETWORK_TYPE === "TESTNET" ? 300000 : 80000,
    },
    serviceUrl: serviceUrl.v2,
  },
  aelfReact: {
    appName: APPNAME,
    nodes: {
      AELF: {
        chainId: "AELF",
        rpcUrl: DEFAUTRPCSERVER,
      },
      tDVW: {
        chainId: "tDVW",
        rpcUrl: DEFAUTRPCSERVER,
      },
      tDVV: {
        chainId: "tDVV",
        rpcUrl: DEFAUTRPCSERVER,
      },
    },
  },
});
