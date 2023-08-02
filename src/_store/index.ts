/*
 * @Author: aelf-lxy
 * @Date: 2023-08-01 20:00:32
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 20:12:19
 * @Description: store
 */

import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './features/counterSlice';
import isPhoneSlice from './features/isPhoneSlice';

const store = configureStore({
  reducer: {
    counter: counterSlice,
    smallScreen: isPhoneSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
