import { createSlice } from '@reduxjs/toolkit';

export interface SmallScreenState {
  isSmallScreen: boolean;
}

const initialState: SmallScreenState = {
  isSmallScreen: false,
};

export const smallScreenSlice = createSlice({
  name: 'smallScreen',
  initialState,
  reducers: {
    ['SET_IS_SMALL_SCREEN']: (state, { payload: payloadObj }) => {
      return payloadObj.payload.isSmallScreen;
    },
  },
});

// Action creators are generated for each case reducer function
export const setIsSmallScreen = (isSmallScreen: boolean) => {
  return smallScreenAction({ type: 'SET_IS_SMALL_SCREEN', payload: { isSmallScreen } });
};
export const smallScreenAction = smallScreenSlice.actions['SET_IS_SMALL_SCREEN'];
export default smallScreenSlice.reducer;
