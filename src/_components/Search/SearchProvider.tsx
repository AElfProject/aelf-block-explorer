/*
 * @Author: aelf-lxy
 * @Date: 2023-08-10 23:31:32
 * @LastEditors: aelf-lxy xiyang.liu@aelf.io
 * @LastEditTime: 2023-08-16 19:06:04
 * @Description: provider
 */
'use client';
import { createContext, useContext, useMemo, useReducer } from 'react';
import { SearchActions, TSearchState, BasicActions, TSearchValidator } from './type';
import reducer from './reducer';

const SearchContext = createContext<any>({});

const useSearchContext = () => {
  return useContext(SearchContext);
};

// function useSearchContext(): { a: TSearchState; b: BasicActions<SearchActions>['dispatch'] } {
//   return useContext(SearchContext);
// }

const SearchContextProvider = ({
  children,
  validator,
}: {
  children: React.ReactNode;
  validator?: TSearchValidator;
}) => {
  const INITIAL_STATE: TSearchState = {
    query: '',
    selectedItem: {},
    highLight: {
      idx: -1,
      txt: '',
    },
    canShowListBox: false,
    queryResultData: {
      dataWithOrderIdx: {},
      allList: [],
    },
    filterType: validator && validator.length > 0 ? validator[0] : undefined,
  };
  console.log('SearchContextProvider');
  const [state, dispatch]: [TSearchState, BasicActions<SearchActions>['dispatch']] = useReducer(reducer, INITIAL_STATE);
  return (
    <SearchContext.Provider
      value={useMemo(
        () => ({
          state,
          dispatch,
        }),
        [state, dispatch],
      )}>
      {children}
    </SearchContext.Provider>
  );
};
export { useSearchContext, SearchContextProvider };
