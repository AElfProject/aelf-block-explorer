'use client';
import { Select } from 'antd';
import { useAppDispatch, useAppSelector } from '@_store';
import { setCurrentChain } from '@_store/features/chainIdSlice';

const { Option } = Select;
import './index.css';

const FULLMAPPING = {
  AELF: 'MainChain AELF',
  tDVV: 'SideChain tDVV',
};

export default function ChainSelect() {
  const { chainArr, currentChain } = useAppSelector((state) => state.getChainId);

  const dispatch = useAppDispatch();

  const onSelectHandler = (value: string) => {
    console.log(value);
    dispatch(setCurrentChain(value));
  };

  console.log('currentChain', currentChain);
  return (
    <div className="chain-select-container">
      <Select
        className="chain-select common-select-wrapper"
        popupClassName="chain-select-options"
        defaultValue={currentChain}
        onSelect={onSelectHandler}
        getPopupContainer={() => document.querySelector('.header-container')!}>
        {chainArr?.map((item) => {
          return (
            <Option on className="common-select-option-wrapper chain-select-option" key={item} value={item}>
              {FULLMAPPING[`${item}`]}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}
