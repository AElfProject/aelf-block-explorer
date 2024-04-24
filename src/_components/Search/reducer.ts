/*
 * @Author: aelf-lxy
 * @Date: 2023-08-11 16:42:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-16 14:49:41
 * @Description: reducer for Search Component
 */
import { SearchActions, TSearchState } from './type';
function reducer(state: TSearchState, { type, payload }: { type: SearchActions; payload: any }) {
  let newState: any = {};
  switch (type) {
    case SearchActions.SET_QUERY: {
      newState = {
        query: payload.query,
      };
      if (state.filterType && Object.keys(state.filterType).length > 0) {
        if (payload.query.length < state.filterType.limitNumber) {
          newState.canShowListBox = false;
        }
      }
      return { ...state, ...newState };
    }

    case SearchActions.SELECT_ITEM: {
      newState = {
        selectedItem: payload.item,
      };
      return { ...state, ...newState };
    }
    case SearchActions.SET_HIGHLIGHTED: {
      newState = {
        highLight: {
          idx: payload.activeItemIdx,
          txt: state.queryResultData.allList[payload.activeItemIdx],
        },
      };
      return { ...state, ...newState };
    }

    case SearchActions.PREV_HIGHLIGHTED: {
      const prevIdx = state.highLight.idx === 0 ? state.queryResultData.allList.length - 1 : state.highLight.idx - 1;
      newState = {
        highLight: {
          idx: prevIdx,
          txt: state.queryResultData.allList[prevIdx],
        },
      };
      return { ...state, ...newState };
    }
    case SearchActions.NEXT_HIGHLIGHTED: {
      const nextIdx = state.highLight.idx === state.queryResultData.allList.length - 1 ? 0 : state.highLight.idx + 1;
      newState = {
        highLight: {
          idx: nextIdx,
          txt: state.queryResultData.allList[nextIdx],
        },
      };
      return { ...state, ...newState };
    }
    case SearchActions.CLEAR: {
      newState = {
        query: '',
        selectedItem: {},
        canShowListBox: false,
        highLight: {
          idx: -1,
          txt: '',
        },
      };
      return { ...state, ...newState };
    }

    case SearchActions.SET_QUERY_RESULT: {
      newState = {
        queryResultData: payload.items,
        canShowListBox: true,
        highLight: {
          idx: -1,
          txt: '',
        },
      };
      return { ...state, ...newState };
    }

    case SearchActions.SET_FILTER_TYPE: {
      newState = {
        filterType: payload.filter,
        queryResultData: {},
        highLight: {
          idx: -1,
          txt: '',
        },
        selectedItem: {},
        query: '',
      };
      return { ...state, ...newState };
    }

    default:
      throw new Error('Invalid action type passed to reducer');
  }
}
export default reducer;
