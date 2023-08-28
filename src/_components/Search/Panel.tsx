'use client';

import { MouseEvent, memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import animateScrollTo from 'animated-scroll-to';
import { useSearchContext } from './SearchProvider';
import Item from './Item';
import { TSearchPanelProps, TSingle } from './type';
import { useKeyEvent } from '@_hooks/useSearch';
import { useThrottleFn } from 'ahooks';
import IconFont from '@_components/IconFont';
function Panel({ id, searchHandler }: TSearchPanelProps) {
  // Global state from context
  const { state } = useSearchContext();
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
        tmpActiveIdx = scrollTopArr.findIndex((_, idx, arr) => {
          return y >= arr[idx] && y < arr[idx + 1];
        });
      }
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
    return (
      <div className="search-result-panel">
        <div className="search-result-empty">
          <IconFont type="result-empty" className="w-3 h-3 mr-1" />
          <span>Sorry, search not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className="search-result-panel">
      <div className="border-color-divider border-b">
        <div className="p-4 flex gap-2">
          {Object.entries(dataWithOrderIdx).map(([searchType], idx) => {
            return (
              <div
                className={clsx('search-result-panel-anchor', activeTabIdx === idx && 'selected')}
                key={searchType + idx}
                onMouseDown={(e) => tabMouseDownHandler(e, idx)}>
                <span>{searchType}</span>
                <span>{`(${idx})`}</span>
              </div>
            );
          })}
        </div>
      </div>
      <ul className="search-result-ul" ref={panelRef}>
        {Object.entries(dataWithOrderIdx).map(([searchType, searchData]: [string, any], pIdx: number) => {
          return (
            <div key={searchType + pIdx} className="search-result-ul-wrap">
              <p className="search-result-ul-title">{searchType}</p>
              {searchData.list.map((item: Partial<TSingle>, index: number) => (
                <Item key={`item${index}`} index={item.sortIdx as number} item={item} />
              ))}
            </div>
          );
        })}
      </ul>
      <div className="search-result-bottom">
        <div className="flex gap-4">
          <div className="search-result-bottom-button-wrap">
            <div className="search-result-bottom-button">
              <IconFont className="w-3 h-3" type="Down" />
            </div>
            <div className="search-result-bottom-button">
              <IconFont className="w-3 h-3" type="Up" />
            </div>
            <span>Navigator</span>
          </div>
          <div className="search-result-bottom-button-wrap">
            <div className="search-result-bottom-button !w-9">
              <span>Esc</span>
            </div>
            <span>Close</span>
          </div>
        </div>
        <div>
          <div className="search-result-bottom-button-wrap">
            <div className="search-result-bottom-button !w-9">
              <IconFont className="w-3 h-3" type="Union" />
            </div>
            <span>Enter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Panel);
