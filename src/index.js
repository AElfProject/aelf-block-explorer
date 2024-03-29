/* eslint-disable camelcase */
/**
 * @file MyWalletCard.js
 * @author huangzongzhe,longyue,zhouminghui
 */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Cookies from "js-cookie";
import VConsole from "vconsole";
import { scheme } from "@portkey/utils";
// 为组件内建文案提供统一的国际化支持。
import { ConfigProvider } from "antd";
import { WebLoginProvider, PortkeyProvider, getConfig } from "aelf-web-login";
// import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from "antd/lib/locale-provider/en_US";
import "@portkey/did-ui-react/dist/assets/index.css";
import "@portkey-v1/did-ui-react/dist/assets/index.css";
import "aelf-web-login/dist/assets/index.css";
// import { AppIncrStore } from './Store';
import store from "./redux/store";
import config from "../config/config";
import { get } from "./utils";
import "./index.less";
import "./portkey.less";

import "./common/webLoginConfig";

import App from "./App";
import { WALLET_IMG } from "./common/constants";
import { isPhoneCheck } from "./common/utils";

// if (process.env.NODE_ENV === "development") {
//   const vConsole = new VConsole();
//   // localStorage.clear();
// }

async function getNodesInfo() {
  const nodesInfoProvider = "/nodes/info";
  const nodesInfo = await get(nodesInfoProvider);

  if (nodesInfo && nodesInfo.list) {
    const nodesInfoList = nodesInfo.list;
    localStorage.setItem("nodesInfo", JSON.stringify(nodesInfoList));

    // todo: MAIN_CHAIN_ID CHAIN_ID
    const nodeInfo = nodesInfoList.find((item) => {
      return item.chain_id === config.CHAIN_ID;
    });
    const { contract_address, chain_id } = nodeInfo;
    localStorage.setItem("currentChain", JSON.stringify(nodeInfo));
    Cookies.set("aelf_ca_ci", contract_address + chain_id);
  }
  // TODO: turn to 404 page.
}

getNodesInfo();

if (module.hot) {
  module.hot.accept();
}

const container = document.getElementById("app");
const isMobile = isPhoneCheck();
ReactDOM.render(
  <ConfigProvider locale={en_US}>
    <Provider store={store}>
      <PortkeyProvider
        networkType={getConfig().networkType}
        networkTypeV2={getConfig().portkeyV2.networkType}
      >
        <WebLoginProvider
          commonConfig={{
            showClose: true,
            iconSrc: WALLET_IMG,
          }}
          extraWallets={["discover", "elf"]}
          nightElf={{ connectEagerly: true }}
          portkey={{
            autoShowUnlock: false,
            checkAccountInfoSync: true,
            design: "SocialDesign",
          }}
          discover={{
            autoRequestAccount: true,
            autoLogoutOnAccountMismatch: true,
            autoLogoutOnChainMismatch: true,
            autoLogoutOnDisconnected: true,
            autoLogoutOnNetworkMismatch: true,
          }}
        >
          <App />
        </WebLoginProvider>
      </PortkeyProvider>
    </Provider>
  </ConfigProvider>,
  container
);
