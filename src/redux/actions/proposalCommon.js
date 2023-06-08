/**
 * @file common actions
 * @author atom-yang
 */
import { message } from "antd";
import { arrayToMap } from "../common/utils";
import walletInstance from "../common/wallet";

// check is exist
export const CHECK_WALLET_EXIST = arrayToMap([
  "CHECK_WALLET_EXIST_START",
  "CHECK_WALLET_EXIST_SUCCESS",
  "CHECK_WALLET_EXIST_FAILED",
]);

export const checkWalletIsExist = () => async (dispatch) => {
  dispatch({
    type: CHECK_WALLET_EXIST.LOG_IN_START,
    payload: {},
  });
  try {
    const detail = await walletInstance.isExist;
    dispatch({
      type: CHECK_WALLET_EXIST.LOG_IN_SUCCESS,
      payload: {
        ...detail,
      },
    });
  } catch (e) {
    dispatch({
      type: CHECK_WALLET_EXIST.LOG_IN_FAILED,
      payload: {},
    });
  }
};

// 登录
export const LOG_IN_ACTIONS = arrayToMap([
  "LOG_IN_START",
  "LOG_IN_SUCCESS",
  "LOG_IN_FAILED",
]);

export const logIn = () => async (dispatch) => {
  dispatch({
    type: LOG_IN_ACTIONS.LOG_IN_START,
    payload: {},
  });
  try {
    const timer = setTimeout(() => {
      // message.warn('Login Timeout');
      dispatch({
        type: LOG_IN_ACTIONS.LOG_IN_FAILED,
        payload: {},
      });
    }, 8000);
    const detail = await walletInstance.login();
    localStorage.setItem(
      "currentWallet",
      JSON.stringify({ ...detail, timestamp: new Date().valueOf() })
    );
    clearTimeout(timer);
    dispatch({
      type: LOG_IN_ACTIONS.LOG_IN_SUCCESS,
      payload: {
        ...detail,
      },
    });
  } catch (e) {
    localStorage.removeItem("currentWallet");
    message.warn((e.errorMessage || {}).message || "night ELF is locked!");
    dispatch({
      type: LOG_IN_ACTIONS.LOG_IN_FAILED,
      payload: {},
    });
  }
};

// 登出
export const LOG_OUT_ACTIONS = arrayToMap([
  "LOG_OUT_START",
  "LOG_OUT_SUCCESS",
  "LOG_OUT_FAILED",
]);

export const logOut = (address) => async (dispatch) => {
  dispatch({
    type: LOG_OUT_ACTIONS.LOG_OUT_START,
    payload: {},
  });
  try {
    await walletInstance.logout(address);
    dispatch({
      type: LOG_OUT_ACTIONS.LOG_OUT_SUCCESS,
      payload: {},
    });
  } catch (e) {
    dispatch({
      type: LOG_OUT_ACTIONS.LOG_OUT_FAILED,
      payload: {},
    });
  }
};
