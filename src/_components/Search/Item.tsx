/*
 * @Author: aelf-lxy
 * @Date: 2023-08-11 16:21:16
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-16 10:40:42
 * @Description: item
 */
import { useContext } from 'react';
import { SearchContext } from './SearchProvider';
import { setHighlighted, selectItem } from './action';
import { TSingle } from './type';
import clsx from 'clsx';

const Item = ({ index, item }: { index: number; item: Partial<TSingle> }) => {
  const { state, dispatch } = useContext(SearchContext);
  const { highLight } = state;
  const isHighlighted = highLight && index === highLight.idx;

  function itemMouseDownHandler() {
    dispatch(selectItem(item));
  }

  function itemMouseEnterHandler() {
    dispatch(setHighlighted(index));
  }
  return (
    <li
      onMouseDown={itemMouseDownHandler}
      onMouseMove={itemMouseEnterHandler}
      data-sort-idx={index}
      className={clsx('mb-1', 'cursor-pointer', 'p-1', 'rounded-md', isHighlighted && 'bg-slate-500')}>
      {item.address || item.name}
    </li>
  );
};

export default Item;
