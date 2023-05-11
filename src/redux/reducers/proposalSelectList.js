import constants from "../common/constants";
import { GET_PROPOSAL_SELECT_LIST } from "../actions/proposalSelectList";

const { proposalTypes, proposalStatus } = constants;

const initialState = {
  params: {
    pageSize: 20,
    pageNum: 1,
    proposalType: proposalTypes.PARLIAMENT,
    isContract: 1,
    // address: currentWallet.address,
    search: "",
    status: proposalStatus.APPROVED,
  },
  list: [],
  total: 0,
  bpCount: 0,
  isAll: false,
};

export const getProposalSelectList = (
  state = initialState,
  { type, payload }
) => {
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
