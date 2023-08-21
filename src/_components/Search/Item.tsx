import { useSearchContext } from './SearchProvider';
import { setHighlighted, selectItem } from './action';
import { TSingle } from './type';
import clsx from 'clsx';

const Item = ({ index, item }: { index: number; item: Partial<TSingle> }) => {
  const { state, dispatch } = useSearchContext();
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
      className={clsx('search-result-ul-item', isHighlighted && 'bg-[#D8DDE5]')}>
      {item.address || item.name}
    </li>
  );
};

export default Item;
