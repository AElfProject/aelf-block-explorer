/**
 * @file organization list reducer
 * @author atom-yang
 */
import { createSlice } from '@reduxjs/toolkit';
import { SET_MODIFY_ORG_DETAIL } from './proposalDetail';

const initialState = {};

export const setModifyOrg = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_MODIFY_ORG_DETAIL:
      return {
        ...payload,
      };
    default:
      return state;
  }
};
export const proposalModifySlice = createSlice({
  name: 'proposalModify',
  initialState,
  reducers: {
    proposalModify: setModifyOrg,
  },
});

export default proposalModifySlice.reducer;
