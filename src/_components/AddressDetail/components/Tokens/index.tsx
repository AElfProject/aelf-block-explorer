import { numberFormatter } from '@_utils/formatter';
import TokensList from './List';
import NFTAssets from './NFTAssets';
import { Divider } from 'antd';
import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
export default function Tokens() {
  const { isMobile } = useMobileAll();
  return (
    <div className="token-container">
      <div className={clsx(isMobile && 'flex-col', 'token-header mx-4 flex border-b border-color-divider pb-4')}>
        <div className="list-items mr-4 box-border w-[197px] pr-4">
          <div className="item-label font10px leading-[18px] text-base-200">NET WORTH IN USD</div>
          <div className="item-value text-sm leading-[22px] text-base-100">
            <span className="inline-block text-sm leading-[22px] text-base-100">$78,330.38</span>
            <span className="ml-1 inline-block text-xs leading-5 text-rise-red">(-0.003%)</span>
          </div>
        </div>
        <div className={clsx(isMobile && 'mt-4 !pl-0', 'list-items pl-4')}>
          <div className="item-label font10px leading-[18px] text-base-200">NET WORTH IN ELF</div>
          <div className="item-value text-sm leading-[22px] text-base-100">{numberFormatter('200924.096', '')}</div>
        </div>
      </div>
      <TokensList SSRData={{ total: 0, list: [] }} />
      <div className="px-4">
        <Divider className="!m-0" />
      </div>
      <NFTAssets SSRData={{ total: 0, list: [] }} />
    </div>
  );
}
