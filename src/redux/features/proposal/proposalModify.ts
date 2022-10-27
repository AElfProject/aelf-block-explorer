/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-27 11:00:21
 * @FilePath: /aelf-block-explorer/src/redux/features/proposal/proposalModify.ts
 * @Description: set modify organizations for orgAddress page
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
