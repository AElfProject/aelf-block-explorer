import { WebLoginState } from "aelf-web-login";

let instance;

export class WebLoginInstance {
  static get() {
    if (!instance) {
      instance = new WebLoginInstance();
    }
    return instance;
  }

  setWebLoginContext(context) {
    this._context = context;
  }

  isAccountInfoSynced() {
    return this._context.accountInfoSync.syncCompleted;
  }

  getWebLoginContext() {
    return this._context;
  }

  callContract(params) {
    return this._context.callContract(params);
  }

  async loginAsync() {
    return new Promise((resolve, reject) => {
      this._loginResolve = resolve;
      this._loginReject = reject;
      this._context.login();
    });
  }

  async logoutAsync() {
    return new Promise((resolve, reject) => {
      this._logoutResolve = resolve;
      this._logoutReject = reject;
      this._context.logout();
    });
  }

  onLoginStateChanged(loginState, loginError) {
    if (
      loginState === WebLoginState.initial &&
      this._loginState === WebLoginState.logouting
    ) {
      this._loginState = loginState;
      if (loginError) {
        this._logoutReject?.(loginError);
      } else {
        this._logoutResolve?.();
      }
      this._logoutReject = null;
      this._logoutResolve = null;
      return;
    }
    this._loginState = loginState;
    if (loginState === WebLoginState.initial && loginError) {
      this._loginReject?.(loginError);
      this._loginReject = null;
      this._loginResolve = null;
    } else if (loginState === WebLoginState.logined) {
      this._loginResolve?.();
      this._loginReject = null;
      this._loginResolve = null;
    }
  }
}
