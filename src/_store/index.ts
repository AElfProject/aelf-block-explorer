/*
 * @Author: aelf-lxy
 * @Date: 2023-08-01 20:00:32
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 20:12:19
 * @Description: store
 */

import { configureStore } from '@reduxjs/toolkit';
import chainIdSlice from './features/chainIdSlice';
import isPhoneSlice from './features/isPhoneSlice';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';

// const store = configureStore({
//   reducer: {
//     getChainId: chainIdSlice,
//     smallScreen: isPhoneSlice,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

const makeStore = () => {
  return configureStore({
    reducer: {
      getChainId: chainIdSlice,
      smallScreen: isPhoneSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppState = ReturnType<AppStore['getState']>;

// const store = makeStore();
// export const dispatch: AppDispatch = store.dispatch;
// export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export { makeStore };
export const wrapper = createWrapper(makeStore, { debug: true });

// export default store;
