import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '@_store';
import { HYDRATE } from 'next-redux-wrapper';
import { ChainItem } from '@_types';
import { ChainId } from '@_utils/contant';
import { Chain } from 'global';

export interface IChainState {
  chainArr: ChainItem[];
  defaultChain: Chain | undefined;
}
const initialState: IChainState = {
  chainArr: [],
  defaultChain: ChainId,
};

export const chainIdSlice = createSlice({
  name: 'getChainId',
  initialState,
  reducers: {
    setDefaultChain: (state, action) => {
      state.defaultChain = action.payload;
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
export const { setDefaultChain, setChainArr } = chainIdSlice.actions;
export const chainInfo = (state: AppState) => state.getChainId;
export default chainIdSlice.reducer;
