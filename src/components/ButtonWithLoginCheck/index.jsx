import React from 'react';
import { WebLoginState, useWebLogin } from "aelf-web-login"
import {
  Button,
} from "antd";

export default function ButtonWithLoginCheck({ children, onClick, ...props }) {
  const { loginState, login } = useWebLogin();

  const onClickInternal = () => {
    if (loginState === WebLoginState.initial || 
      loginState === WebLoginState.eagerly || 
      loginState === WebLoginState.lock) {
      login();
    } 
    else if (loginState === WebLoginState.logined) {
      onClick?.();
    }
  };

  return (<Button {...props} onClick={onClickInternal}>{children}</Button>);
}
