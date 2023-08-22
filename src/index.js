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
import { PortkeyConfigProvider } from "@portkey/did-ui-react";
import { WebLoginProvider } from "aelf-web-login";
// import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from "antd/lib/locale-provider/en_US";
import "@portkey/did-ui-react/dist/assets/index.css";
import "aelf-web-login/dist/assets/index.css";
// import { AppIncrStore } from './Store';
import store from "./redux/store";
import config from "../config/config";
import { get } from "./utils";
import "./index.less";
import "./portkey.less";

import "./common/webLoginConfig";
import "./public-path";
import App from "./App";
import { WALLET_IMG } from "./common/constants";
import { isPhoneCheck } from "./common/utils";

if (process.env.NODE_ENV === "development") {
  const vConsole = new VConsole();
  // localStorage.clear();
}

function render(props) {
  const { container } = props;
  ReactDOM.render(
    <App />,
    container
      ? container.querySelector("#root")
      : document.querySelector("#root")
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log("[react16] react app bootstraped");
}

export async function mount(props) {
  console.log("[react16] props from main framework", props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container
      ? container.querySelector("#root")
      : document.querySelector("#root")
  );
}
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

const continueDefaultBehaviour = () => {
  const downloadUrl = "https://portkey.finance/";
  const href = scheme.formatScheme({
    action: "linkDapp",
    domain: window.location.host,
    custom: {
      url: window.location.href,
    },
  });
  window.location.href = href;
  setTimeout(() => {
    const hidden =
      window.document.hidden ||
      window.document.mozHidden ||
      window.document.msHidden ||
      window.document.webkitHidden;
    if (typeof hidden !== "undefined" && hidden === true) {
      return;
    }
    window.location.href = downloadUrl;
  }, 2000);
};
const container = document.getElementById("app");
const isMobile = isPhoneCheck();
ReactDOM.render(
  <ConfigProvider locale={en_US}>
    <Provider store={store}>
      <PortkeyConfigProvider>
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
            onClick: isMobile
              ? () => {
                  continueDefaultBehaviour();
                }
              : null,
          }}
        >
          <App />
        </WebLoginProvider>
      </PortkeyConfigProvider>
    </Provider>
  </ConfigProvider>,
  container
);
