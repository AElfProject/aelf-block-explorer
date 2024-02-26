'use client';
import { IAddressResponse } from '@_types/commonDetail';
import HeadTitle from '@_components/HeaderTitle';
import Copy from '@_components/Copy';
import IconFont from '../IconFont/index';
import QrCode from '@_components/QrCode';
import Overview from './components/overview';
import { numberFormatter } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import { TitleEnum } from '@_types/commonDetail';
import EPTabs from '../EPTabs/index';
import TransctionList from '@app/transactions/list';
import TokenTransfers from '@_components/TokenTransfers';
import NFTTransfers from '@_components/NFTTransfers';
import History from './components/History';
import { useState } from 'react';
import Events from './components/Events';
import Contract from './components/Contract';
import Tokens from './components/Tokens';
import clsx from 'clsx';
import { useMobileContext } from '@app/pageProvider';
import './index.css';
import EPTooltip from '@_components/EPToolTip';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
export default function AddressDetail({
  SSRData,
  title,
  hash,
}: {
  SSRData: IAddressResponse;
  title: TitleEnum;
  hash: string;
}) {
  const {
    tokenBalance,
    transactions,
    tokenTransfers,
    author,
    tokenTotalPriceInUsd,
    tokenPriceInUsd,
    contractName,
    tokenHoldings,
    lastTxnSend,
  } = SSRData;
  const OverviewInfo = [
    {
      label: 'ELF BALANCE',
      value: (
        <div>
          <IconFont className="mr-1" type="Aelf-transfer" />
          <span>{tokenBalance ? numberFormatter(tokenBalance) : '-'}</span>
        </div>
      ),
    },
    {
      label: 'ELF VALUE IN USD',
      value: (
        <span>
          {tokenBalance ? (
            <span>
              <span className="mr-1 inline-block text-sm leading-[22px]">{`$${numberFormatter(
                String(tokenTotalPriceInUsd),
              )}`}</span>
              <span className="inline-block text-xs leading-5">{`(@ $${numberFormatter(
                String(tokenPriceInUsd),
                '',
              )}/ELF)`}</span>
            </span>
          ) : (
            '-'
          )}
        </span>
      ),
    },
    {
      label: 'TOKEN HOLDINGS',
      value: <span className="inline-block leading-[22px]">{tokenHoldings} Tokens</span>,
    },
  ];
  const addressMoreInfo = [
    {
      label: 'LAST TXN SENT',
      value: (
        <div className="flex items-center">
          <span className="inline-block max-w-[120px] truncate text-sm leading-[22px] text-link">{lastTxnSend}</span>
          <span className="inline-block text-xs leading-5 text-base-100">from 20 sece ago</span>
        </div>
      ),
    },
    {
      label: 'FIRST TXN SENT',
      value: (
        <div className="flex items-center">
          <span className="inline-block max-w-[120px] truncate text-sm leading-[22px] text-link">{lastTxnSend}</span>
          <span className="inline-block text-xs leading-5 text-base-100">from 20 sece ago</span>
        </div>
      ),
    },
  ];
  const contractInfo = [
    {
      label: 'CONTRACT NAME',
      value: contractName,
    },
    {
      label: 'AUTHOR',
      value: (
        <div className="flex items-center text-sm leading-[22px]">
          <span className="text-link">{addressFormat(hiddenAddress(author))}</span>
          <span className="mx-1">at txn</span>
          <span className="inline-block max-w-[120px] truncate text-link">b12da253552df07b12da253552df07</span>
        </div>
      ),
    },
  ];

  const [selectKey, setSelectKey] = useState<string>('');
  const onTabClick = (key) => {
    setSelectKey(key);
  };
  const items = [
    {
      key: '',
      label: 'Tokens',
      children: <Tokens />,
    },
    {
      key: 'Txns',
      label: 'Transactions',
      children: (
        <TransctionList showHeader={false} SSRData={{ total: transactions.total, data: [...transactions.list] }} />
      ),
    },
    {
      key: 'tokentxns',
      label: 'Token Transfers',
      children: <TokenTransfers SSRData={{ total: transactions.total, data: [...tokenTransfers.list] }} />,
    },
    {
      key: 'nfttransfers',
      label: 'NFT Transfers',
      children: (
        <NFTTransfers showHeader={false} SSRData={{ total: transactions.total, data: [...tokenTransfers.list] }} />
      ),
    },
    {
      key: 'contract',
      label: 'Contract',
      children: <Contract />,
    },
    {
      key: 'events',
      label: 'Events',
      children: <Events SSRData={{ total: 0, list: [] }} />,
    },
    {
      key: 'history',
      label: 'History',
      children: <History SSRData={[]} onTabClick={onTabClick} />,
    },
  ];

  const { isMobile } = useMobileAll();
  return (
    <div className="address-detail">
      <div className="address-header">
        <HeadTitle className={isMobile && 'flex-col !items-start'} content={title}>
          <div className={clsx('code-box ml-2', isMobile && '!ml-0 flex flex-wrap items-center')}>
            <span className="break-all text-sm leading-[22px] ">
              {hash}
              <Copy className="!ml-4" value={hash} />
              <EPTooltip
                placement="bottom"
                mode="light"
                getPopupContainer={(node) => node}
                trigger="click"
                title={<QrCode value={hash} />}>
                <IconFont className="ml-4 cursor-pointer text-xs" type="QR-Code" />
              </EPTooltip>
            </span>
          </div>
        </HeadTitle>
      </div>
      <div className={clsx(isMobile && 'flex-col', 'address-overview flex')}>
        <Overview title="Overview" className={clsx(isMobile && '!mr-0 mb-4', 'mr-4 flex-1')} items={OverviewInfo} />
        <Overview
          title="MoreInfo"
          className="flex-1"
          items={title === TitleEnum.Address ? addressMoreInfo : contractInfo}
        />
      </div>
      <div className="address-main mt-4">
        <EPTabs selectKey={selectKey} items={items} />
      </div>
    </div>
  );
}
