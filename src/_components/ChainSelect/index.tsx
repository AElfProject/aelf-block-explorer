'use client';
import { Select } from 'antd';
import microApp from '@micro-zoe/micro-app';
import { useAppDispatch, useAppSelector } from '@_store';
import { setDefaultChain } from '@_store/features/chainIdSlice';
import { useRouter } from 'next/navigation';
const { Option } = Select;
import './index.css';

export default function ChainSelect() {
  const { chainArr, defaultChain } = useAppSelector((state) => state.getChainId);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onChangeHandler = (value: string) => {
    microApp.setData('governance', { type: 'logoutSilently' });
    setTimeout(() => {
      dispatch(setDefaultChain(value));
      router.push(`/?chainId=${value}`);
    }, 1000);
  };

  return (
    <div className="chain-select-container">
      <Select
        className="chain-select common-select-wrapper"
        popupClassName="chain-select-options"
        value={defaultChain}
        popupMatchSelectWidth={false}
        onChange={onChangeHandler}>
        {chainArr?.map((item) => {
          return (
            <Option className="common-select-option-wrapper chain-select-option" key={item.key} value={item.key}>
              {chainArr.find((ele) => ele.key === item.key)!.label}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}
