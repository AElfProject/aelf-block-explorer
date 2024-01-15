/**
 * @file organization list reducer
 * @author atom-yang
 */
import constants, { LOADING_STATUS } from "../common/constants";
import { GET_PROPOSALS_LIST } from "../actions/proposalList";

const { proposalTypes, proposalStatus } = constants;

const initialState = {
  params: {
    pageSize: 6,
    pageNum: 1,
    search: "",
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

export const getProposalList = (state = initialState, { type, payload }) => {
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
