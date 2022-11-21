/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-27 11:03:16
 * @FilePath: /aelf-block-explorer/src/redux/store.ts
 * @Description: summary of store
 */

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import smallScreenReducer from './features/smallScreen/isSmallScreen';
import commonReducer from './features/proposal/common';
import organizationsReducer from './features/proposal/organizationList';
import proposalsReducer from './features/proposal/proposalList';
import proposalSelectReducer from './features/proposal/proposalSelectList';
import proposalModifyReducer from './features/proposal/proposalModify';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    smallScreen: smallScreenReducer,
    common: commonReducer,
    organizations: organizationsReducer,
    proposals: proposalsReducer,
    proposalSelect: proposalSelectReducer,
    proposalModify: proposalModifyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
