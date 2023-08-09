/*
 * @Author: aelf-lxy
 * @Date: 2023-08-07 13:50:45
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-10 15:44:57
 * @Description: the result panel of search
 */
'use client';

import { MouseEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import animateScrollTo from 'animated-scroll-to';
import { TSearchPanelProps, TSingle } from './type';

function Panel({ searchList, setKeyWordFn, query, resetEmpty }: TSearchPanelProps) {
  const { allList, dataWithOrderIdx } = searchList;
  const panelRef = useRef<HTMLUListElement>(null);
  const anchorArr = useRef<HTMLParagraphElement[]>([]);
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const [activeItemIdx, setActiveItemIdx] = useState<number>(0);

  const moveToTarget = useCallback((idx: number, pNode: HTMLElement) => {
    const activeItemDOMNode = pNode?.querySelector(`[data-sort-idx="${idx}"]`);
    animateScrollTo(activeItemDOMNode as HTMLElement, {
      speed: 100,
      elementToScroll: pNode,
      verticalOffset: -100,
    });
  }, []);

  useEffect(() => {
    function keyupHandler(e: KeyboardEvent) {
      if (allList.length === 0) {
        return;
      }
      if (e.key === 'ArrowUp') {
        setActiveItemIdx((c) => {
          const nextIdx = c === 0 ? allList.length - 1 : c - 1;
          moveToTarget(nextIdx, panelRef.current as HTMLElement);
          return nextIdx;
        });
        // setKeyWordFn(allList[activeItemIdx]);
      } else if (e.key === 'ArrowDown') {
        setActiveItemIdx((c) => {
          const nextIdx = c === allList.length - 1 ? 0 : c + 1;
          moveToTarget(nextIdx, panelRef.current as HTMLElement);
          return nextIdx;
        });
        // setKeyWordFn(allList[activeItemIdx]);
      } else if (e.key === 'Enter') {
        setKeyWordFn(allList[activeItemIdx]);
      } else if (e.key === 'Escape') {
        resetEmpty();
      }
    }
    document.addEventListener('keyup', keyupHandler);
    return () => {
      document.removeEventListener('keyup', keyupHandler);
    };
  }, [activeItemIdx, allList, moveToTarget, setKeyWordFn, resetEmpty]);

  useEffect(() => {
    anchorArr.current = Array.from(panelRef.current?.querySelectorAll<HTMLParagraphElement>('p') || []);
  }, [query]);

  const scrollHandler = useCallback(() => {
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
  }, []);

  useEffect(() => {
    const dom = panelRef.current;
    if (!dom) {
      return;
    }
    dom.addEventListener('scroll', scrollHandler);
    return () => {
      dom.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler]);

  function tabClickHandler(idx: number) {
    panelRef.current?.removeEventListener('scroll', scrollHandler);
    setActiveTabIdx(idx);
    const node = anchorArr.current[idx];

    animateScrollTo(node, { speed: 100, elementToScroll: panelRef.current as HTMLElement }).then(() => {
      setTimeout(() => {
        panelRef.current?.addEventListener('scroll', scrollHandler);
      }, 50);
    });
  }

  function itemClickHandler(e: MouseEvent<HTMLLIElement>, item: Partial<TSingle>) {
    e.stopPropagation();
    // resetEmpty();
    setKeyWordFn(item);
  }

  function itemMouseOverHandler(e: MouseEvent<HTMLLIElement>, item: Partial<TSingle>) {
    // e.stopPropagation();
    setActiveItemIdx(item.sortIdx as number);
  }

  if (!query) {
    return null;
  }

  return (
    <div className="w-full flex-grow absolute z-[100] shadow bg-white top-[32px]" onMouseDown={() => {}}>
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
                activeTabIdx === idx && 'bg-blue-700',
              )}
              onClick={() => tabClickHandler(idx)}>
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
              {searchData.list.map((item: Partial<TSingle>) => (
                <li
                  onClick={(e) => {
                    itemClickHandler(e, item);
                  }}
                  onMouseOver={(e) => itemMouseOverHandler(e, item)}
                  key={item.address || item.name}
                  data-sort-idx={item.sortIdx}
                  className={clsx(
                    'mb-1',
                    'hover:bg-slate-500',
                    'cursor-pointer',
                    'p-1',
                    'rounded-md',
                    'transition-colors',
                    'duration-150',
                    activeItemIdx === item.sortIdx && 'bg-slate-500',
                  )}>
                  {item.address || item.name}
                </li>
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
