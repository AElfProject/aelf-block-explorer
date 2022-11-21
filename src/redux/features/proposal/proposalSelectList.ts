/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-27 11:01:45
 * @FilePath: /aelf-block-explorer/src/redux/features/proposal/proposalSelectList.ts
 * @Description: get proposal select list for proposalSearch page
 */

import { createSlice } from '@reduxjs/toolkit';
import { API_PATH } from 'constants/viewerApi';
import { request } from 'utils/request';
import { arrayToMap } from 'page-components/Proposal/common/utils';
import constants from 'page-components/Proposal/common/constants';
export const GET_PROPOSAL_SELECT_LIST = arrayToMap([
  'SET_PROPOSALS_SELECT_LIST_START',
  'SET_PROPOSALS_SELECT_LIST_SUCCESS',
  'SET_PROPOSALS_SELECT_LIST_FAIL',
  'DESTORY',
]);

const dispatchSelectList =
  ({ params, result }) =>
  (dispatch) => {
    try {
      dispatch(
        proposalSelectAction({
          type: GET_PROPOSAL_SELECT_LIST.SET_PROPOSALS_SELECT_LIST_START,
          payload: {
            params,
            list: result?.list ?? [],
            total: result?.total ?? 0,
            bpCount: result?.bpCount ?? 0,
          },
        }),
      );
    } catch (e) {
      dispatch({
        type: GET_PROPOSAL_SELECT_LIST.SET_PROPOSALS_LIST_FAIL,
        payload: {},
      });
    }
  };

export const getProposalSelectListWrap = async (dispatch, params) => {
  const result = await request(API_PATH.GET_PROPOSAL_LIST, params, {
    method: 'GET',
  });
  dispatch(dispatchSelectList({ params, result }));
  return true;
};

export const destorySelectList = () => (dispatch) => {
  dispatch(proposalSelectAction(GET_PROPOSAL_SELECT_LIST.DESTORY));
};

const { proposalTypes, proposalStatus } = constants;

const initialState = {
  params: {
    pageSize: 20,
    pageNum: 1,
    proposalType: proposalTypes.PARLIAMENT,
    isContract: 1,
    // address: currentWallet.address,
    search: '',
    status: proposalStatus.APPROVED,
  },
  list: [],
  total: 0,
  bpCount: 0,
  isAll: false,
};

export const getProposalSelectList = (state = initialState, { payload: payloadObj }) => {
  const { type, payload } = payloadObj;

  switch (type) {
    case GET_PROPOSAL_SELECT_LIST.SET_PROPOSALS_SELECT_LIST_START:
      // const { list, params, total } = payload ?? {};
      // eslint-disable-next-line no-case-declarations
      let selectList = [];
      if (payload?.params.pageNum > 1) {
        selectList = state.list.concat(payload.list);
      } else {
        selectList = payload.list;
      }
      return {
        ...state,
        list: selectList,
        total: payload.total,
        bpCount: payload.bpCount,
        isAll: !(payload.total >= selectList.length),
        params: {
          ...state.params,
          ...(payload?.params ?? {}),
        },
      };
    case GET_PROPOSAL_SELECT_LIST.DESTORY:
      return initialState;
    default:
      return state;
  }
};
export const proposalSelectSlice = createSlice({
  name: 'proposalSelect',
  initialState,
  reducers: {
    proposalSelect: getProposalSelectList,
  },
});
export const proposalSelectAction = proposalSelectSlice.actions.proposalSelect;

export default proposalSelectSlice.reducer;
