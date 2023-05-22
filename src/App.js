/**
 * @file App
 * @author huangzongzhe
 */
import React, { Suspense, useCallback, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useLocation } from "react-use";
import BrowserHeader from "./components/Header/Header";
import HeaderBlank from "./components/Header/HeaderBlank";
import BrowserFooter from "./components/Footer/Footer";
import BrowserBreadcrumb from "./components/Breadcrumb/Breadcrumb";
import Container from "./components/Container/Container";
import { PageRouter } from "./routes/routes";
import { useDispatch, useSelector } from "react-redux";

import {
  LOG_IN_ACTIONS,
  LOG_OUT_ACTIONS,
} from "./redux/actions/proposalCommon";

import "./App.less";
import { useWebLogin, WebLoginState } from "aelf-web-login";
import { WebLoginInstance } from "./utils/webLogin";

function App() {
  const { pathname } = useLocation();
  const { wallet, loginState, loginError } = useWebLogin();
  const dispatch = useDispatch();
  const currentWallet = useSelector(state => {
    return state.common.currentWallet;
  });
  
  const webLoginContext = useWebLogin();
  console.log(webLoginContext);
  WebLoginInstance.get().setWebLoginContext(webLoginContext);

  const back2Top = useCallback(() => {
    const app = document.querySelector('#app')
    if (app) {
      app.scrollIntoView({ block: 'start', behavior: 'auto' })
    }
  }, [])

  useEffect(() => {
    back2Top()
  }, [pathname])

  useEffect(() => {
    console.log(loginState, wallet);
    if (loginState === WebLoginState.initial && currentWallet.address) {
      dispatch({
        type: LOG_OUT_ACTIONS.LOG_OUT_SUCCESS,
      })
    }
    else if (loginState === WebLoginState.initial && loginError) {
      dispatch({
        type: LOG_IN_ACTIONS.LOG_IN_FAILED,
      })
    }
    else if (loginState === WebLoginState.logining) {
      dispatch({
        type: LOG_IN_ACTIONS.LOG_IN_START,
      });
    }
    else if (loginState === WebLoginState.logined) {
      dispatch({
        type: LOG_IN_ACTIONS.LOG_IN_SUCCESS,
        payload: wallet,
      })
    }
  }, [loginState])

  return (
    <Suspense fallback={null}>
      <div className='App'>
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
