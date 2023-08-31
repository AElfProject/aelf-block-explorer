import { INetworkItem } from '@_types';
import { Select } from 'antd';
const { Option } = Select;
import './index.css';
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
interface IProps {
  networkList: INetworkItem[];
}
export default function ChainSelect({ networkList }: IProps) {
  const changeChain = (chainId) => {
    const chainInfo = networkList.find((item) => item.chainId === chainId);
    if (chainInfo?.chainsLink) window.location.href = chainInfo?.chainsLink;
  };
  return (
    <div className="chain-select-container">
      <Select
        className="chain-select common-select-wrapper"
        popupClassName="chain-select-options"
        defaultValue={CHAIN_ID}
        getPopupContainer={() => document.querySelector('.header-container')!}
        onChange={(v) => changeChain(v)}>
        {networkList.map((item) => {
          return (
            <Option
              className="common-select-option-wrapper chain-select-option"
              key={item.chainsLink + Math.random()}
              value={item.chainId || ''}>
              {item.chainsLinkName.replace('chain', '')}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}
