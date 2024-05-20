import React from "react";
import { WebLoginState, useWebLogin } from "aelf-web-login";
import { Button } from "antd";
import debounce from "lodash.debounce";
import { showAccountInfoSyncingModal } from "../SimpleModal/index.tsx";

export default function ButtonWithLoginCheck({
  children,
  onClick,
  checkAccountInfoSync,
  ...props
}) {
  const { loginState, login, wallet } = useWebLogin();

  const onClickInternal = (event) => {
    if (
      loginState === WebLoginState.initial ||
      loginState === WebLoginState.eagerly ||
      loginState === WebLoginState.lock
    ) {
      login();
    } else if (loginState === WebLoginState.logined) {
      if (checkAccountInfoSync) {
        if (!wallet.accountInfoSync.syncCompleted) {
          showAccountInfoSyncingModal();
          return;
        }
      }
      debounce(onClick?.(event), 300);
    }
  };

  return (
    <Button
      {...props}
      onClick={onClickInternal}
      loading={
        loginState === WebLoginState.logining ||
        loginState === WebLoginState.logouting ||
        props.loading
      }
    >
      {children}
    </Button>
  );
}
