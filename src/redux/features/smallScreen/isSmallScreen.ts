import { createSlice } from '@reduxjs/toolkit';

export interface SmallScreenState {
  isSmallScreen: boolean;
}

const initialState: SmallScreenState = {
  isSmallScreen: false,
};

export const counterSlice = createSlice({
  name: 'smallScreen',
  initialState,
  reducers: {
    ['SET_IS_SMALL_SCREEN']: (isSmallScreen) => isSmallScreen,
  },
});

// Action creators are generated for each case reducer function
export const setIsSmallScreen = counterSlice.actions['SET_IS_SMALL_SCREEN'];

export default counterSlice.reducer;
