/*
 * @Author: aelf-lxy
 * @Date: 2023-08-11 15:07:01
 * @LastEditors: aelf-lxy xiyang.liu@aelf.io
 * @LastEditTime: 2023-08-16 19:07:43
 * @Description: hooks for Search Component
 */
import { useSearchContext } from '@_components/Search/SearchProvider';
import { setQueryResult, highlightPrev, highlightNext, setClear } from '@_components/Search/action';
import { TSingle, TSearchList } from '@_components/Search/type';
import { RefObject, useEffect } from 'react';
import request from '@_api';
import animateScrollTo from 'animated-scroll-to';
import { useDebounce } from 'react-use';
export const useUpdateDataByQuery = () => {
  const { state, dispatch } = useSearchContext();
  const { query, filterType } = state;

  useDebounce(
    () => {
      if (!query) {
        return;
      }
      function tmp(arr) {
        return {
          tokens: {
            total: 11,
            list: arr.slice(0, 5).map((ele) => ({ address: ele.description, name: ele.title })),
          },
          nfts: {
            total: 11,
            list: arr.slice(5, 10).map((ele) => ({ address: ele.description, name: ele.title })),
          },
        };
      }

      const formatData = (data: TSearchList) => {
        try {
          const arr: Partial<TSingle>[] = Object.values(data).reduce((acc, ele) => {
            return acc.concat(ele.list);
          }, [] as Partial<TSingle>[]);
          arr.forEach((ele, idx) => {
            ele.sortIdx = idx;
          });
          return {
            dataWithOrderIdx: data,
            allList: arr,
          };
        } catch (e) {
          throw new Error('format data error');
        }
      };

      const fetchData = async () => {
        const { products } = await request.block.query({ params: { q: query } });
        dispatch(setQueryResult(formatData(tmp(products))));
      };
      if (typeof filterType === 'object' && filterType !== null) {
        const { limitNumber } = filterType;
        if (query.length >= limitNumber) {
          fetchData();
        }
      } else {
        fetchData();
      }
    },
    300,
    [dispatch, query, filterType],
  );
};

export const useSelected = (selectedItem: Partial<TSingle>, inputRef: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    console.log('inputRef.current', inputRef.current);
    if (!inputRef.current) {
      return;
    }
    if (!selectedItem || Object.keys(selectedItem).length === 0) {
      inputRef.current.value = '';
    } else {
      inputRef.current.value = (selectedItem.address || selectedItem.name) as string;
    }
  }, [inputRef, selectedItem]);
};

export const useHighlight = (highLight, inputRef: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    if (highLight && highLight.txt && inputRef.current)
      inputRef.current.value = highLight.txt.address || highLight.txt.name;
  }, [highLight, inputRef]);
};

export const useKeyEvent = (
  panelRef: RefObject<HTMLUListElement>,
  setActiveTabIdx: (val: number) => void,
  searchHandler: () => void,
) => {
  const { state, dispatch } = useSearchContext();
  const { highLight, queryResultData } = state;
  const { idx: highLightIdx } = highLight;
  const { allList = [] } = queryResultData;
  useEffect(() => {
    const moveToTarget = (idx: number, pNode: HTMLElement) => {
      if (idx < 0) {
        return;
      }
      const activeItemDOMNode = pNode?.querySelector(`[data-sort-idx="${idx}"]`);
      animateScrollTo(activeItemDOMNode as HTMLElement, {
        speed: 100,
        elementToScroll: pNode,
        verticalOffset: -100,
      });
    };
    if (panelRef.current && highLightIdx === 0) {
      moveToTarget(0, panelRef.current as HTMLElement);
    }
    if (panelRef.current && highLightIdx === allList.length - 1) {
      moveToTarget(allList.length - 1, panelRef.current as HTMLElement);
    }

    function keyupHandler(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') {
        moveToTarget(highLightIdx, panelRef.current as HTMLElement);
        dispatch(highlightPrev());
      } else if (e.key === 'ArrowDown') {
        moveToTarget(highLightIdx, panelRef.current as HTMLElement);
        dispatch(highlightNext());
      } else if (e.key === 'Enter') {
        // dispatch(selectItem(allList[highLightIdx]));
        searchHandler();
      } else if (e.key === 'Escape') {
        setActiveTabIdx(0);
        dispatch(setClear());
      }
    }

    document.addEventListener('keyup', keyupHandler);
    return () => {
      document.removeEventListener('keyup', keyupHandler);
    };
  }, [highLightIdx, allList, dispatch, panelRef, setActiveTabIdx, searchHandler]);
};
