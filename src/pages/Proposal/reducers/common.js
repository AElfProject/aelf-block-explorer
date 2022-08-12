/**
 * @file list reducer
 * @author yangmutong
 */
import AElf from 'aelf-sdk';
import walletInstance from '../common/wallet';
import {
  LOG_OUT_ACTIONS,
  LOG_IN_ACTIONS,
} from '../actions/common';
import constants, {
  LOG_STATUS,
} from '../common/constants';

const {
  DEFAUT_RPCSERVER,
} = constants;

const initialState = {
  aelf: new AElf(new AElf.providers.HttpProvider(DEFAUT_RPCSERVER)),
  logStatus: LOG_STATUS.LOG_OUT,
  isALLSettle: false,
  loading: false,
  wallet: walletInstance,
  currentWallet: {},
};

export const common = (state = initialState, { type, payload }) => {
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
    default:
      return state;
  }
};
