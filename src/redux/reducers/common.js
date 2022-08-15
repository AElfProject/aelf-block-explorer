/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-11-04 17:12:43
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-11-04 18:36:13
 * @Description: file content
 */
// todo: Consider to save isSmallScreen as a global variable instead of saving in redux
import AElf from "aelf-sdk";
import walletInstance from "@pages/proposal/common/wallet";
import {
  LOG_OUT_ACTIONS,
  LOG_IN_ACTIONS,
} from "@pages/proposal/actions/common";
import constants, { LOG_STATUS } from "@pages/proposal/common/constants";

const { DEFAUT_RPCSERVER } = constants;

const initialState = {
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
    case "SET_IS_SMALL_SCREEN":
      return { ...state, isSmallScreen: payload.isSmallScreen };
    default:
      return state;
  }
};

export default common;
