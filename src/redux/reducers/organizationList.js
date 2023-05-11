/**
 * @file organization list reducer
 * @author atom-yang
 */
import constants, { LOADING_STATUS } from "../common/constants";
import { GET_ORGANIZATIONS_LIST } from "../actions/organizationList";

const { proposalTypes } = constants;

const initialState = {
  params: {
    pageSize: 6,
    pageNum: 1,
    search: "",
    proposalType: proposalTypes.PARLIAMENT,
  },
  total: 0,
  list: [],
  bpList: [],
  parliamentProposerList: [],
  loadingStatus: LOADING_STATUS.LOADING,
};

export const getOrganization = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ORGANIZATIONS_LIST.GET_ORGANIZATIONS_LIST_START:
      return {
        ...state,
        loadingStatus: LOADING_STATUS.LOADING,
        params: {
          ...state.params,
          ...payload,
        },
      };
    case GET_ORGANIZATIONS_LIST.GET_ORGANIZATIONS_LIST_SUCCESS:
      return {
        ...state,
        ...payload,
        loadingStatus: LOADING_STATUS.SUCCESS,
      };
    case GET_ORGANIZATIONS_LIST.GET_ORGANIZATIONS_LIST_FAIL:
      return {
        ...state,
        loadingStatus: LOADING_STATUS.FAILED,
      };
    default:
      return state;
  }
};
