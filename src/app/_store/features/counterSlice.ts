/*
 * @Author: aelf-lxy
 * @Date: 2023-08-01 20:09:57
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 20:36:31
 * @Description: demo
 */

import { createSlice } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
  title: string;
}
const initialState: CounterState = {
  value: 0,
  title: 'redux toolkit pre',
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});
export const { increment, decrement } = counterSlice.actions;

export default counterSlice.reducer;
