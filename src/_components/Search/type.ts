/*
 * @Author: aelf-lxy
 * @Date: 2023-08-09 11:15:16
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-16 14:38:11
 * @Description: type file for Search Component
 */
export type TSingle = {
  image: string;
  name: string;
  symbol: string;
  price: number;
  unit: string;
  address: string;
  sortIdx: number;
};

export type TItem = {
  total: number;
  list: Partial<TSingle>[];
};

type TType = 'tokens' | 'nfts' | 'accounts' | 'contracts';

export type TSearchList = {
  [key in TType]?: TItem;
};

export type TFormatSearchList = {
  dataWithOrderIdx: TSearchList;
  allList: Partial<TSingle>[];
};

export type TValidator = {
  label: string;
  limitNumber: number;
  key: number;
};
export type TSearchValidator = Array<TValidator>;

export type TSearchPanelProps = {
  id: string;
  searchHandler: () => void;
};

export type TSearchState = {
  // entered keywords
  query: string;
  // selected item
  selectedItem: Partial<TSingle>;
  // query result
  queryResultData: TFormatSearchList;
  // item need to be highlight
  highLight: {
    idx: number;
    txt: string;
  };
  // identifies whether to display the listbox
  canShowListBox: boolean;
  // filter flag
  filterType?: TValidator;
};

export type BasicActions<T = string> = {
  dispatch: (actions: { type: T; payload: any }) => void;
};

export interface ISearchProps {
  searchValidator?: TSearchValidator;
  placeholder?: string;
}

export enum SearchActions {
  SET_QUERY_RESULT = 'SET_QUERY_RESULT',
  SET_QUERY = 'SET_QUERY',
  SELECT_ITEM = 'SELECT_ITEM',
  CLEAR = 'CLEAR',
  SET_HIGHLIGHTED = 'SET_HIGHLIGHTED',
  PREV_HIGHLIGHTED = 'PREV_HIGHLIGHTED',
  NEXT_HIGHLIGHTED = 'NEXT_HIGHLIGHTED',
  SET_FILTER_TYPE = 'SET_FILTER_TYPE',
}