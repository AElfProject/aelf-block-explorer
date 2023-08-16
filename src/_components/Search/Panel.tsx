/*
 * @Author: aelf-lxy
 * @Date: 2023-08-07 13:50:45
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-16 14:18:58
 * @Description: the result panel of search
 */
'use client';

import { MouseEvent, memo, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import animateScrollTo from 'animated-scroll-to';
import { SearchContext } from './SearchProvider';
import Item from './Item';
import { TSearchPanelProps, TSingle } from './type';
import { useKeyEvent } from '@_hooks/useSearch';
import { useThrottleFn } from 'ahooks';
function Panel({ id, searchHandler }: TSearchPanelProps) {
  // Global state from context
  const { state } = useContext(SearchContext);
  const { query, queryResultData } = state;
  const { allList = [], dataWithOrderIdx } = queryResultData;
  // Component state
  const panelRef = useRef<HTMLUListElement>(null);
  const anchorArr = useRef<HTMLParagraphElement[]>([]);
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);

  useKeyEvent(panelRef, setActiveTabIdx, searchHandler);

  useEffect(() => {
    anchorArr.current = Array.from(panelRef.current?.querySelectorAll<HTMLParagraphElement>('p') || []);
  }, [allList]);

  useEffect(() => {
    if (!query) {
      setActiveTabIdx(0);
    }
  }, [query]);
  const { run: scrollHandler } = useThrottleFn(
    () => {
      if (!panelRef.current) {
        return;
      }

      const y: number = panelRef.current.scrollTop;
      const scrollTopArr: number[] = anchorArr.current.map((item) => item.offsetTop);

      let tmpActiveIdx = -1;
      if (
        // highlight the last item if bottom is reached
        (panelRef.current as HTMLElement).getBoundingClientRect().height + y ===
        (panelRef.current as HTMLElement).scrollHeight
      ) {
        tmpActiveIdx = scrollTopArr.length - 1;
      } else {
        tmpActiveIdx = scrollTopArr.findIndex((ele, idx, arr) => {
          return y >= arr[idx] && y < arr[idx + 1];
        });
      }
      console.log('tmpActiveIdx', tmpActiveIdx);
      setActiveTabIdx(tmpActiveIdx);
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    },
  );

  useEffect(() => {
    const dom = panelRef.current;
    if (!dom) {
      return;
    }
    dom.addEventListener('scroll', scrollHandler);
    return () => {
      dom.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler, allList]);

  function tabMouseDownHandler(e: MouseEvent<HTMLElement>, idx: number) {
    e.preventDefault();
    panelRef.current?.removeEventListener('scroll', scrollHandler);
    setActiveTabIdx(idx);
    const node = anchorArr.current[idx];

    animateScrollTo(node, { speed: 100, elementToScroll: panelRef.current as HTMLElement }).then(() => {
      setTimeout(() => {
        panelRef.current?.addEventListener('scroll', scrollHandler);
      }, 50);
    });
  }

  if (!query) {
    return null;
  }

  if (allList.length === 0) {
    return <div className="search-result-panel">no result</div>;
  }

  return (
    <div id={id} className="search-result-panel">
      <div className="p-2">
        {Object.entries(dataWithOrderIdx).map(([searchType], idx) => {
          return (
            <span
              key={searchType + idx}
              className={clsx(
                'rounded-full',
                'p-1',
                'bg-red-400',
                'cursor-pointer',
                activeTabIdx === idx && 'bg-yellow-600',
              )}
              onMouseDown={(e) => tabMouseDownHandler(e, idx)}>
              {searchType + idx}
            </span>
          );
        })}
      </div>
      <ul className="px-4 overflow-auto relative max-h-[420px]" ref={panelRef}>
        {Object.entries(dataWithOrderIdx).map(([searchType, searchData]: [string, any], pIdx: number) => {
          return (
            <div key={searchType + pIdx}>
              <p className="border-t border-slate-100">{searchType}</p>
              {searchData.list.map((item: Partial<TSingle>, index: number) => (
                <Item key={`item${index}`} index={item.sortIdx as number} item={item} />
              ))}
            </div>
          );
        })}
      </ul>
      <div className="px-4 py-2 flex justify-between border-t border-slate-100">
        <div className="items-center">
          <span>navigator</span>
          <span>esc</span>
        </div>
        <div className="items-center">
          <span>enter</span>
        </div>
      </div>
    </div>
  );
}

export default memo(Panel);
