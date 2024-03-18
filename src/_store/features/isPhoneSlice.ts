/*
 * @Author: aelf-lxy
 * @Date: 2023-08-01 20:05:45
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 20:54:26
 * @Description:
 */
import { createSlice } from '@reduxjs/toolkit';

export interface ISmallScreenState {
  isSmallScreen: boolean;
}

const initialState: ISmallScreenState = {
  isSmallScreen: false,
};

export const smallScreenSlice = createSlice({
  name: 'smallScreen',
  initialState,
  reducers: {
    SET_IS_SMALL_SCREEN: (state, { payload: payloadObj }) => {
      return {
        isSmallScreen: payloadObj.payload.isSmallScreen,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { SET_IS_SMALL_SCREEN } = smallScreenSlice.actions;
export default smallScreenSlice.reducer;
