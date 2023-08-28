/*
 * @Author: aelf-lxy
 * @Date: 2023-08-03 14:20:36
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 15:12:38
 * @Description: Search component
 */
'use client';
// import request from '@_api';
import { useState, useRef, MouseEvent, memo, isValidElement } from 'react';
import clsx from 'clsx';
import Panel from './Panel';
import SearchSelect from './Select';
import { useUpdateDataByQuery, useSelected, useHighlight } from '@_hooks/useSearch';
import { ISearchProps } from './type';
import { useSearchContext } from './SearchProvider';
import { setQuery, setClear } from './action';
import { Button } from 'antd';
import IconFont from '@_components/IconFont';
// import { useRouter } from 'next/navigation';

const randomId = () => `searchbox-${(0 | (Math.random() * 6.04e7)).toString(36)}`;

const Search = ({
  lightMode,
  isMobile,
  searchValidator,
  placeholder,
  searchButton,
  onSearchButtonClickHandler,
  searchIcon,
  enterIcon,
  deleteIcon,
  searchWrapClassNames,
  searchInputClassNames,
}: ISearchProps) => {
  // const router = useRouter();

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
  const hasEnterButton = !!query && enterIcon;

  useUpdateDataByQuery();
  useSelected(selectedItem, queryInput);
  useHighlight(highLight, queryInput);

  function cancelBtnHandler(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    queryInput.current!.value = '';
    dispatch(setClear());
  }

  // const searchHandler = useCallback(() => {
  //   router.push(`/chainId/search/${queryInput.current!.value}`);
  // }, [router]);

  const onSearchHandler = () => {
    onSearchButtonClickHandler && onSearchButtonClickHandler(queryInput.current!.value);
  };

  function renderButton() {
    if (!searchButton) {
      return null;
    }
    if (isValidElement(searchButton)) {
      return <div onClick={onSearchHandler}>{searchButton}</div>;
    }
    return (
      <Button
        className="search-button"
        type="primary"
        icon={<IconFont className="w-4 h-4" type="search" />}
        onClick={onSearchHandler}
      />
    );
  }

  return (
    <div
      className={clsx('searchbox-wrap', searchWrapClassNames, lightMode && 'searchbox-wrap-light')}
      aria-expanded={isExpanded}>
      <SearchSelect searchValidator={searchValidator} />
      <div className="search-input-wrap">
        {searchIcon && (
          <div className="search-input-query-icon">
            <IconFont type="search" />
          </div>
        )}
        <input
          className={clsx('search-input', searchInputClassNames, isMobile && 'search-input-mobile')}
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
          <div className="search-input-clear" onMouseDown={cancelBtnHandler}>
            <IconFont type="clear" />
          </div>
        )}
        {hasEnterButton && (
          <div className="search-input-enter" onClick={onSearchHandler}>
            <IconFont className="w-3 h-3" type="Union" />
          </div>
        )}
      </div>
      {renderButton()}
      {isExpanded && <Panel id={randomId()} searchHandler={onSearchHandler} />}
    </div>
  );
};
export default memo(Search);
