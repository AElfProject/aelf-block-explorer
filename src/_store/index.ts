/*
 * @Author: aelf-lxy
 * @Date: 2023-08-01 20:00:32
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 20:12:19
 * @Description: store
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import chainIdSlice from './features/chainIdSlice';
import isPhoneSlice from './features/isPhoneSlice';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';

const rootReducer = combineReducers({
  getChainId: chainIdSlice,
  isPhone: isPhoneSlice,
});

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppState = ReturnType<AppStore['getState']>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export { makeStore };
export const wrapper = createWrapper(makeStore, { debug: true });
export const store: AppStore = makeStore();

// export default store;
