/**
 * @file organization actions
 * @author atom-yang
 */
import { createSlice } from '@reduxjs/toolkit';
import { API_PATH } from 'constants/viewerApi';
import { request } from 'utils/request';
import { arrayToMap } from 'page-components/Proposal/common/utils';
import constants, { LOADING_STATUS } from 'page-components/Proposal/common/constants';

export const GET_ORGANIZATIONS_LIST = arrayToMap([
  'GET_ORGANIZATIONS_LIST_START',
  'GET_ORGANIZATIONS_LIST_SUCCESS',
  'GET_ORGANIZATIONS_LIST_FAIL',
]);

export const getOrganizations = (params) => async (dispatch) => {
  dispatch(
    organizationsAction({
      type: GET_ORGANIZATIONS_LIST.GET_ORGANIZATIONS_LIST_START,
      payload: params,
    }),
  );
  try {
    const result = await request(API_PATH.GET_ORGANIZATIONS, params, {
      method: 'GET',
    });
    dispatch(
      organizationsAction({
        type: GET_ORGANIZATIONS_LIST.GET_ORGANIZATIONS_LIST_SUCCESS,
        payload: result,
      }),
    );
  } catch (e) {
    console.log(e);
    dispatch(
      organizationsAction({
        type: GET_ORGANIZATIONS_LIST.GET_ORGANIZATIONS_LIST_FAIL,
        payload: {},
      }),
    );
  }
};

const { proposalTypes } = constants;

const initialState = {
  params: {
    pageSize: 6,
    pageNum: 1,
    search: '',
    proposalType: proposalTypes.PARLIAMENT,
  },
  total: 0,
  list: [],
  bpList: [],
  parliamentProposerList: [],
  loadingStatus: LOADING_STATUS.LOADING,
};

export const getOrganization = (state = initialState, { payload: payloadObj }) => {
  const { type, payload } = payloadObj;
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

export const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    organizations: getOrganization,
  },
});

export const organizationsAction = organizationsSlice.actions.organizations;

export default organizationsSlice.reducer;
