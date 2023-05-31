import { getConfig, setGlobalConfig } from "aelf-web-login";
import {
  APPNAME,
  CHAIN_ID,
  DEFAUTRPCSERVER,
  NETWORK_TYPE,
  CHAINS_LINK,
  CHAINS_LINK_NAMES,
} from "@config/config";

setGlobalConfig({
  appName: APPNAME,
  chainId: CHAIN_ID,
  portkey: {
    useLocalStorage: true,
    graphQLUrl: '/Portkey_DID/PortKeyIndexerCASchema/graphql',
    socialLogin: {
      Portkey: {
        websiteName: APPNAME,
        websiteIcon: `${CHAINS_LINK[CHAIN_ID]}/favicon.main.ico`,
      },
    },
    requestDefaults: {
      baseURL: "/portkey",
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
          graphQLUrl: '/Portkey_DID/PortKeyIndexerCASchema/graphql',
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

console.log(getConfig());
