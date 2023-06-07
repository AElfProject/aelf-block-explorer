import React from 'react';
import { WebLoginState, useWebLogin } from "aelf-web-login"
import {
  Button,
} from "antd";
import { showAccountInfoSyncingModal } from "../SimpleModal/index.tsx";

export default function ButtonWithLoginCheck({ children, onClick, checkAccountInfoSync, ...props }) {
  const { loginState, login, wallet } = useWebLogin();

  const onClickInternal = (event) => {
    if (loginState === WebLoginState.initial || 
      loginState === WebLoginState.eagerly || 
      loginState === WebLoginState.lock) {
      login();
    } 
    else if (loginState === WebLoginState.logined) {
      if (checkAccountInfoSync) {
        if (!wallet.accountInfoSync.syncCompleted) {
          showAccountInfoSyncingModal();
          return;
        }
      }
      onClick?.(event);
    }
  };

  return (<Button {...props} onClick={onClickInternal} 
    loading={loginState === WebLoginState.logining || loginState === WebLoginState.logouting}>{children}</Button>);
}
