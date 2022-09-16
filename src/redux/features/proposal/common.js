/**
 * @file common actions
 * @author atom-yang
 */
import { createSlice } from '@reduxjs/toolkit';
import AElf from 'aelf-sdk';
import { message } from 'antd';
import { arrayToMap } from 'page-components/Proposal/common/utils';
import walletInstance, { walletInstanceSingle } from 'page-components/Proposal/common/wallet';
import constants, { LOG_STATUS } from 'page-components/Proposal/common/constants';

// check is exist
export const CHECK_WALLET_EXIST = arrayToMap([
  'CHECK_WALLET_EXIST_START',
  'CHECK_WALLET_EXIST_SUCCESS',
  'CHECK_WALLET_EXIST_FAILED',
]);

export const checkWalletIsExist = () => async (dispatch) => {
  dispatch({
    type: CHECK_WALLET_EXIST.LOG_IN_START,
    payload: {},
  });
  try {
    const detail = await walletInstanceSingle().isExist;
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
export const LOG_IN_ACTIONS = arrayToMap(['LOG_IN_START', 'LOG_IN_SUCCESS', 'LOG_IN_FAILED']);

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
    const detail = await walletInstanceSingle().login();
    localStorage.setItem('currentWallet', JSON.stringify({ ...detail, timestamp: new Date().valueOf() }));
    clearTimeout(timer);
    dispatch({
      type: LOG_IN_ACTIONS.LOG_IN_SUCCESS,
      payload: {
        ...detail,
      },
    });
  } catch (e) {
    console.log(e, 'e');
    localStorage.removeItem('currentWallet');
    message.warn((e.errorMessage || {}).message || 'night ELF is locked!');
    dispatch({
      type: LOG_IN_ACTIONS.LOG_IN_FAILED,
      payload: {},
    });
  }
};

// 登出
export const LOG_OUT_ACTIONS = arrayToMap(['LOG_OUT_START', 'LOG_OUT_SUCCESS', 'LOG_OUT_FAILED']);

export const logOut = (address) => async (dispatch) => {
  dispatch({
    type: LOG_OUT_ACTIONS.LOG_OUT_START,
    payload: {},
  });
  try {
    await walletInstanceSingle().logout(address);
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

const { DEFAUT_RPCSERVER } = constants;

export const initialState = {
  isSmallScreen: false,
  aelf: new AElf(new AElf.providers.HttpProvider(DEFAUT_RPCSERVER)),
  logStatus: LOG_STATUS.LOG_OUT,
  isALLSettle: false,
  loading: false,
  wallet: walletInstance,
  currentWallet: {},
};

const common = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOG_IN_ACTIONS.LOG_IN_START:
      return {
        ...state,
        logStatus: LOG_STATUS.LOG_OUT,
        loading: true,
        currentWallet: {},
      };
    case LOG_IN_ACTIONS.LOG_IN_SUCCESS:
      return {
        ...state,
        logStatus: LOG_STATUS.LOGGED,
        isALLSettle: true,
        loading: false,
        currentWallet: {
          ...payload,
        },
      };
    case LOG_IN_ACTIONS.LOG_IN_FAILED:
      return {
        ...state,
        logStatus: LOG_STATUS.LOG_OUT,
        isALLSettle: true,
        loading: false,
        currentWallet: {},
      };
    case LOG_OUT_ACTIONS.LOG_OUT_START:
      return {
        ...state,
        loading: true,
      };
    case LOG_OUT_ACTIONS.LOG_OUT_SUCCESS:
      return {
        ...state,
        logStatus: LOG_STATUS.LOG_OUT,
        loading: false,
        currentWallet: {},
      };
    case LOG_OUT_ACTIONS.LOG_OUT_FAILED:
      return {
        ...state,
        loading: false,
      };
    case 'SET_IS_SMALL_SCREEN':
      return { ...state, isSmallScreen: payload.isSmallScreen };
    default:
      return state;
  }
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    common,
  },
});

export default commonSlice.reducer;
