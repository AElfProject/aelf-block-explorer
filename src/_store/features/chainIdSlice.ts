import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '@_store';
import { HYDRATE } from 'next-redux-wrapper';
import { ChainItem } from '@_types';

export interface IChainState {
  chainArr: ChainItem[];
  currentChain: Chain | undefined;
}
const initialState: IChainState = {
  chainArr: [],
  currentChain: undefined,
};

export const chainIdSlice = createSlice({
  name: 'getChainId',
  initialState,
  reducers: {
    setCurrentChain: (state, action) => {
      state.currentChain = action.payload;
    },
    setChainArr: (state, action) => {
      state.chainArr = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});
export const { setCurrentChain, setChainArr } = chainIdSlice.actions;
export const chainInfo = (state: AppState) => state.getChainId;
export default chainIdSlice.reducer;
