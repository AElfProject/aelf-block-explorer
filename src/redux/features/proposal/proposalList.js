/**
 * @file organization actions
 * @author atom-yang
 */
import { createSlice } from '@reduxjs/toolkit';
import { API_PATH } from 'constants/viewerApi';
import { request } from 'utils/request';
import { arrayToMap } from 'page-components/Proposal/common/utils';
import constants, { LOADING_STATUS } from 'page-components/Proposal/common/constants';

export const GET_PROPOSALS_LIST = arrayToMap([
  'GET_PROPOSALS_LIST_START',
  'GET_PROPOSALS_LIST_SUCCESS',
  'GET_PROPOSALS_LIST_FAIL',
]);

export const getProposals = (params) => async (dispatch) => {
  dispatch(
    proposalsAction({
      type: GET_PROPOSALS_LIST.GET_PROPOSALS_LIST_START,
      payload: params,
    }),
  );
  try {
    const result = await request(API_PATH.GET_PROPOSAL_LIST, params, {
      method: 'GET',
    });
    dispatch(
      proposalsAction({
        type: GET_PROPOSALS_LIST.GET_PROPOSALS_LIST_SUCCESS,
        payload: result,
      }),
    );
  } catch (e) {
    dispatch(
      proposalsAction({
        type: GET_PROPOSALS_LIST.GET_PROPOSALS_LIST_FAIL,
        payload: {},
      }),
    );
  }
};

const { proposalTypes, proposalStatus } = constants;

export const initialState = {
  params: {
    pageSize: 6,
    pageNum: 1,
    search: '',
    proposalType: proposalTypes.PARLIAMENT,
    isContract: 0,
    status: proposalStatus.ALL,
  },
  total: 0,
  bpCount: 1,
  list: [],
  isAudit: false,
  status: LOADING_STATUS.LOADING,
};

export const getProposalList = (state = initialState, { payload: payloadObj }) => {
  const { type, payload } = payloadObj;
  switch (type) {
    case GET_PROPOSALS_LIST.GET_PROPOSALS_LIST_START:
      return {
        ...state,
        status: LOADING_STATUS.LOADING,
        params: {
          ...state.params,
          ...payload,
        },
      };
    case GET_PROPOSALS_LIST.GET_PROPOSALS_LIST_SUCCESS:
      return {
        ...state,
        ...payload,
        status: LOADING_STATUS.SUCCESS,
      };
    case GET_PROPOSALS_LIST.GET_PROPOSALS_LIST_FAIL:
      return {
        ...state,
        total: 0,
        bpCount: 1,
        list: [],
        isAudit: false,
        status: LOADING_STATUS.FAILED,
      };
    default:
      return state;
  }
};
export const proposalsSlice = createSlice({
  name: 'proposals',
  initialState,
  reducers: {
    proposals: getProposalList,
  },
});
export const proposalsAction = proposalsSlice.actions.proposals;

export default proposalsSlice.reducer;
