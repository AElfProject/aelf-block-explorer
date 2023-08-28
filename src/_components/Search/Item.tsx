import Image from 'next/image';
import { useSearchContext } from './SearchProvider';
import { setHighlighted, selectItem } from './action';
import { TSingle } from './type';
import clsx from 'clsx';
import Logo from 'public/next.svg';
import IconFont from '@_components/IconFont';

const Item = ({ index, item }: { index: number; item: Partial<TSingle> }) => {
  const { state, dispatch } = useSearchContext();
  const { highLight } = state;
  const isHighlighted = highLight && index === highLight.idx;
  const tmpFlag = true;
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
      {tmpFlag ? (
        <>
          {item.address && <span className="search-result-ul-item-circle">C</span>}
          <span>
            <Image className="object-contain w-6 h-6 rounded" width={24} height={24} src={Logo} alt="" />
          </span>
          <span>{(item.address || item.name)?.slice(0, 10)}</span>
          <span className="search-result-ul-item-gray">(BEAN3CRV-fBEAN3CRV-fBEAN3…)</span>
          <span className="search-result-ul-item-button">
            <span>$</span>
            <span>11.22</span>
          </span>
        </>
      ) : (
        <div className="flex-col">
          <p className="leading-20">Name : AELF.ContractNames.Token</p>
          <p className="search-result-ul-item-gray leading-20">
            <IconFont type="Contract" className="w-3 h-3 mr-1" />
            <span>{item.address || item.name}</span>
          </p>
        </div>
      )}
    </li>
  );
};

export default Item;
