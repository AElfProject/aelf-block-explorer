/**
 * @file organization list reducer
 * @author atom-yang
 */
import { SET_MODIFY_ORG_DETAIL } from "@pages/proposal/actions/proposalDetail";

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
