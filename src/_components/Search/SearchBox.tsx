/*
 * @Author: aelf-lxy
 * @Date: 2023-08-03 14:20:36
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 15:12:38
 * @Description: Search component
 */
'use client';
// import request from '@_api';
import { useState, useRef, MouseEvent, memo, useCallback, isValidElement } from 'react';
import clsx from 'clsx';
import Panel from './Panel';
import SearchSelect from './Select';
import { useUpdateDataByQuery, useSelected, useHighlight } from '@_hooks/useSearch';
import { ISearchProps } from './type';
import { useSearchContext } from './SearchProvider';
import { setQuery, setClear } from './action';
import { Button } from 'antd';
import IconFont from '@_components/IconFont';
import { useRouter } from 'next/navigation';

const randomId = () => `searchbox-${(0 | (Math.random() * 6.04e7)).toString(36)}`;

const Search = ({
  searchValidator,
  placeholder,
  searchButton,
  onSearchButtonClickHandler,
  searchIcon,
  deleteIcon,
  searchWrapClassNames,
  searchInputClassNames,
}: ISearchProps) => {
  const router = useRouter();

  // Global state from context
  const { state, dispatch } = useSearchContext();
  const { query, selectedItem, highLight, canShowListBox } = state;

  // Component state
  const [hasFocus, setHasFocus] = useState<boolean>(false);

  // DOM references
  const queryInput = useRef<HTMLInputElement>(null);

  // Calculated states
  const isExpanded = hasFocus && canShowListBox;
  const hasClearButton = !!query && deleteIcon;

  useUpdateDataByQuery();
  useSelected(selectedItem, queryInput);
  useHighlight(highLight, queryInput);

  function cancelBtnHandler(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    queryInput.current!.value = '';
    dispatch(setClear());
  }

  const searchHandler = useCallback(() => {
    router.push(`/chainId/search/${queryInput.current!.value}`);
  }, [router]);

  function renderButton() {
    if (!searchButton) {
      return null;
    }
    if (isValidElement(searchButton)) {
      return (
        <div
          onClick={() => {
            onSearchButtonClickHandler && onSearchButtonClickHandler(queryInput.current!.value);
          }}>
          {searchButton}
        </div>
      );
    }
    return (
      <Button
        className="search-button"
        type="primary"
        icon={<IconFont className="w-4 h-4" type="search" />}
        onClick={searchHandler}
      />
    );
  }

  return (
    <div className={clsx('searchbox-wrap', searchWrapClassNames)} aria-expanded={isExpanded}>
      <SearchSelect searchValidator={searchValidator} />
      <div className="search-input-wrap">
        {searchIcon && <IconFont className="w-4 h-4 mr-2" type="search" />}
        <input
          className={clsx('search-input', searchInputClassNames)}
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
          <IconFont
            className="w-4 h-4 absolute right-4 cursor-pointer"
            type="ClearDefault"
            onMouseDown={cancelBtnHandler}
          />
        )}
      </div>
      {renderButton()}
      {/* TODO: destroy Panel time? */}
      {isExpanded && (
        <Panel
          id={randomId()}
          searchHandler={searchHandler}
          // key={!query ? randomId() : 1}
        />
      )}
    </div>
  );
};
export default memo(Search);
