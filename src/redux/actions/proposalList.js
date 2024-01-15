/**
 * @file organization actions
 * @author atom-yang
 */
import { request } from '../../common/request';
import { API_PATH } from '../common/constants';
import { arrayToMap } from '../common/utils';

export const GET_PROPOSALS_LIST = arrayToMap([
  'GET_PROPOSALS_LIST_START',
  'GET_PROPOSALS_LIST_SUCCESS',
  'GET_PROPOSALS_LIST_FAIL',
]);

export const getProposals = (params) => async (dispatch) => {
  dispatch({
    type: GET_PROPOSALS_LIST.GET_PROPOSALS_LIST_START,
    payload: params,
  });
  try {
    const result = await request(API_PATH.GET_PROPOSAL_LIST, params, {
      method: 'GET',
    });
    dispatch({
      type: GET_PROPOSALS_LIST.GET_PROPOSALS_LIST_SUCCESS,
      payload: result,
    });
  } catch (e) {
    dispatch({
      type: GET_PROPOSALS_LIST.GET_PROPOSALS_LIST_FAIL,
      payload: {},
    });
  }
};
