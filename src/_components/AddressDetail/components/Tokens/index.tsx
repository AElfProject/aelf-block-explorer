import { numberFormatter } from '@_utils/formatter';
import TokensList from './List';
import NFTAssets from './NFTAssets';
import { Divider } from 'antd';
import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';
export default function Tokens() {
  const { isMobileSSR: isMobile } = useMobileContext();
  return (
    <div className="token-container">
      <div className={clsx(isMobile && 'flex-col', 'token-header border-b border-color-divider flex pb-4 mx-4')}>
        <div className="list-items box-border w-[197px] mr-4 pr-4">
          <div className="item-label leading-[18px] text-base-200 font10px">NET WORTH IN USD</div>
          <div className="item-value text-sm leading-[22px] text-base-100">
            <span className="text-sm leading-[22px] text-base-100 inline-block">$78,330.38</span>
            <span className="inline-block text-xs leading-5 ml-1 text-rise-red">(-0.003%)</span>
          </div>
        </div>
        <div className={clsx(isMobile && '!pl-0 mt-4', 'list-items pl-4')}>
          <div className="item-label leading-[18px] text-base-200 font10px">NET WORTH IN ELF</div>
          <div className="item-value text-sm leading-[22px] text-base-100">{numberFormatter('200924.096', '')}</div>
        </div>
      </div>
      <TokensList SSRData={{ total: 0, list: [] }} />
      <Divider className="!m-0" />
      <NFTAssets SSRData={{ total: 0, list: [] }} />
    </div>
  );
}
