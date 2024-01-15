/**
 * @file App
 * @author huangzongzhe
 */
import React, { Suspense, useCallback, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useLocation } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import {
  useWebLoginEvent,
  useWebLogin,
  WebLoginState,
  useLoginState,
  WebLoginEvents,
  ERR_CODE,
} from "aelf-web-login";
import BrowserHeader from "./components/Header/Header";
import HeaderBlank from "./components/Header/HeaderBlank";
import BrowserFooter from "./components/Footer/Footer";
import BrowserBreadcrumb from "./components/Breadcrumb/Breadcrumb";
import Container from "./components/Container/Container";
import { PageRouter } from "./routes/routes";
import {
  LOG_IN_ACTIONS,
  LOG_OUT_ACTIONS,
} from "./redux/actions/proposalCommon";
import "./App.less";
import {
  onlyOkModal,
  showAccountInfoSyncingModal,
} from "./components/SimpleModal/index.tsx";
import { WebLoginInstance } from "./utils/webLogin";

function App() {
  const { pathname } = useLocation();
  const { wallet, loginError, eventEmitter } = useWebLogin();
  const dispatch = useDispatch();
  const currentWallet = useSelector((state) => {
    return state.common.currentWallet;
  });

  const webLoginContext = useWebLogin();
  WebLoginInstance.get().setWebLoginContext(webLoginContext);
  console.log(webLoginContext.wallet);

  const back2Top = useCallback(() => {
    const app = document.querySelector("#app");
    if (app) {
      app.scrollIntoView({ block: "start", behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    back2Top();
  }, [pathname]);

  useLoginState(
    (loginState) => {
      console.log(wallet, loginState, loginError, eventEmitter, "xxxx");
      if (loginState === WebLoginState.initial && currentWallet.address) {
        dispatch({
          type: LOG_OUT_ACTIONS.LOG_OUT_SUCCESS,
        });
      } else if (loginState === WebLoginState.initial && loginError) {
        dispatch({
          type: LOG_IN_ACTIONS.LOG_IN_FAILED,
        });
      } else if (loginState === WebLoginState.logining) {
        dispatch({
          type: LOG_IN_ACTIONS.LOG_IN_START,
        });
      } else if (loginState === WebLoginState.logined) {
        dispatch({
          type: LOG_IN_ACTIONS.LOG_IN_SUCCESS,
          payload: wallet,
        });
      }
      WebLoginInstance.get().onLoginStateChanged(loginState, loginError);
    },
    [dispatch]
  );

  const onLoginError = useCallback((error) => {
    if (error.code) {
      if (error.code === ERR_CODE.NETWORK_TYPE_NOT_MATCH) {
        onlyOkModal({
          message: "Please switch the extension to the correct network.",
        });
      } else if (error.code === ERR_CODE.ACCOUNTS_IS_EMPTY) {
        showAccountInfoSyncingModal();
      }
      return;
    }
    message.error(error.message);
  }, []);
  useWebLoginEvent(WebLoginEvents.LOGIN_ERROR, onLoginError);

  return (
    <Suspense fallback={null}>
      <div className="App">
        <BrowserRouter>
          <BrowserHeader />
          <HeaderBlank />
          <BrowserBreadcrumb />
          <Container>
            <PageRouter />
          </Container>
          <BrowserFooter />
        </BrowserRouter>
      </div>
    </Suspense>
  );
}
// if (module.hot) {
//   module.hot.accept();
// }
// export default hot(App);
export default App;
