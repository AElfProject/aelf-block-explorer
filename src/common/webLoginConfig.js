import { getConfig, setGlobalConfig } from "aelf-web-login";
import { APPNAME, CHAIN_ID, DEFAUTRPCSERVER } from "@config/config";

const IS_MAINNET = false;
setGlobalConfig({
  appName: APPNAME,
  chainId: CHAIN_ID,
  portkey: {
    useLocalStorage: true,
    graphQLUrl: "/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql",
    socialLogin: {
      Portkey: {
        // "explorer-test-side02.aelf.io"
        websiteName: "explorer.aelf.io",
        websiteIcon: "https://explorer.aelf.io/favicon.main.ico",
      },
    },
    requestDefaults: {
      baseURL: "/portkey",
    },
    network: {
      defaultNetwork: IS_MAINNET ? "MAIN" : "TESTNET",
      networkList: [
        {
          name: "aelf MAIN",
          walletType: "aelf",
          networkType: IS_MAINNET ? "MAIN" : "TESTNET",
          isActive: true,
          apiUrl: "",
          graphQLUrl: "/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql",
          connectUrl: "",
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
    },
  },
});

console.log(getConfig());
