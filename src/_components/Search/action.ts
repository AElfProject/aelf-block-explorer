/*
 * @Author: aelf-lxy
 * @Date: 2023-08-11 14:03:20
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-15 16:52:04
 * @Description: actions
 */

import { SearchActions, TSingle, TFormatSearchList, TValidator } from './type';

export const setQueryResult = (searchData: TFormatSearchList) => ({
  type: SearchActions.SET_QUERY_RESULT,
  payload: {
    items: searchData,
  },
});

export const setQuery = (keywords: string) => ({
  type: SearchActions.SET_QUERY,
  payload: {
    query: keywords,
  },
});

export const highlightPrev = () => ({
  type: SearchActions.PREV_HIGHLIGHTED,
});

export const highlightNext = () => ({
  type: SearchActions.NEXT_HIGHLIGHTED,
});

export const setHighlighted = (idx: number) => ({
  type: SearchActions.SET_HIGHLIGHTED,
  payload: {
    activeItemIdx: idx,
  },
});

export const selectItem = (item: Partial<TSingle>) => ({
  type: SearchActions.SELECT_ITEM,
  payload: {
    item: item,
  },
});

export const setClear = () => ({
  type: SearchActions.CLEAR,
});

export const setFilterType = (filterObj: TValidator) => ({
  type: SearchActions.SET_FILTER_TYPE,
  payload: {
    filter: filterObj,
  },
});
