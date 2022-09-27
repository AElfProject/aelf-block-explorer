/**
 * @file organization list reducer
 * @author atom-yang
 */
import { createSlice } from '@reduxjs/toolkit';
import { SET_MODIFY_ORG_DETAIL } from './proposalDetail';

const initialState = {};

export const setModifyOrg = (state = initialState, { payload: payloadObj }) => {
  const { type, payload } = payloadObj;
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
export const proposalModifyAction = proposalModifySlice.actions.proposalModify;

export default proposalModifySlice.reducer;
