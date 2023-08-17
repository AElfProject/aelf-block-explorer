/*
 * @Author: aelf-lxy
 * @Date: 2023-08-03 14:20:36
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-16 14:50:12
 * @Description: Search component
 */
'use client';
// import request from '@_api';
import { useState, useRef, MouseEvent, useContext, memo, useCallback } from 'react';

import Panel from './Panel';
import SearchSelect from './Select';
import { useUpdateDataByQuery, useSelected, useHighlight } from '@_hooks/useSearch';
import { ISearchProps } from './type';
import { SearchContext } from './SearchProvider';
import { setQuery, setClear } from './action';
import { Button } from 'antd';
import IconFont from '@_components/IconFont';
import { useRouter } from 'next/navigation';

const randomId = () => `searchbox-${(0 | (Math.random() * 6.04e7)).toString(36)}`;

const Search = ({ searchValidator, placeholder }: ISearchProps) => {
  const router = useRouter();

  // Global state from context
  const { state, dispatch } = useContext(SearchContext);
  const { query, selectedItem, highLight, canShowListBox } = state;
  console.log('selectedItem', selectedItem);

  // Component state
  const [hasFocus, setHasFocus] = useState<boolean>(false);

  // DOM references
  const queryInput = useRef<HTMLInputElement>(null);

  // Calculated states
  const isExpanded = hasFocus && canShowListBox;
  const hasClearButton = !!query;

  useUpdateDataByQuery();
  useSelected(selectedItem, queryInput);
  useHighlight(highLight, queryInput);

  function cancelBtnHandler(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    queryInput.current!.value = '';
    dispatch(setClear());
  }

  const searchHandler = useCallback(() => {
    router.push(`/111111/search/${queryInput.current!.value}`);
  }, [router]);

  return (
    <div className="searchbox-wrap" aria-expanded={isExpanded}>
      <SearchSelect searchValidator={searchValidator} />
      <div className="search-input-wrap">
        <input
          className="search-input"
          ref={queryInput}
          placeholder={placeholder}
          onFocus={() => {
            setHasFocus(true);
          }}
          onBlur={() => {
            setHasFocus(false);
          }}
          onChange={(e) => {
            dispatch(setQuery(e.target.value));
          }}
        />
        {hasClearButton && (
          <button className="absolute right-0" onMouseDown={cancelBtnHandler}>
            X
          </button>
        )}
        {/* TODO: destroy Panel time? */}
        {isExpanded && (
          <Panel
            id={randomId()}
            searchHandler={searchHandler}
            // key={!query ? randomId() : 1}
          />
        )}
      </div>
      <Button
        className="search-button"
        type="primary"
        icon={<IconFont className="w-4 h-4" type="search" />}
        onClick={searchHandler}
      />
    </div>
  );
};
export default memo(Search);
