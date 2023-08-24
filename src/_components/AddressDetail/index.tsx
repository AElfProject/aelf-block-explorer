'use client';
import { IAddressResponse } from '@_types/commenDetail';
import HeadTitle from '@_components/HeaderTitle';
import Copy from '@_components/Copy';
import IconFont from '../IconFont/index';
import { Tooltip } from 'antd';
import QrCode from '@_components/QrCode';
import Overview from './components/overview';
import { numberFormatter } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import { TitleEnum } from '@_types/commenDetail';
import EPTabs from '../EPTabs/index';
import TransctionList from '@app/transactions/list';
import TokenTransfers from '@_components/TokenTransfers';
import NFTTransfers from '@_components/NFTTransfers';
import History from './components/History';
import { useState } from 'react';
import Events from './components/Events';
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
              <span className="mr-1 text-sm inline-block leading-[22px]">{`$${numberFormatter(
                String(tokenTotalPriceInUsd),
              )}`}</span>
              <span className="text-xs inline-block leading-5">{`(@ $${numberFormatter(
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
          <span className="text-link inline-block truncate max-w-[120px] text-sm leading-[22px]">{lastTxnSend}</span>
          <span className="text-base-100 inline-block text-xs leading-5">from 20 sece ago</span>
        </div>
      ),
    },
    {
      label: 'FIRST TXN SENT',
      value: (
        <div className="flex items-center">
          <span className="text-link inline-block truncate max-w-[120px] text-sm leading-[22px]">{lastTxnSend}</span>
          <span className="text-base-100  inline-block text-xs leading-5">from 20 sece ago</span>
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
        <div className="text-sm leading-[22px] flex items-center">
          <span className="text-link">{addressFormat(hiddenAddress(author))}</span>
          <span className="mx-1">at txn</span>
          <span className="inline-block text-link max-w-[120px] truncate">b12da253552df07b12da253552df07</span>
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
      children: <div>Tokens</div>,
    },
    {
      key: 'Txns',
      label: 'Transactions',
      children: (
        <TransctionList
          showHeader={false}
          isMobileSSR={false}
          SSRData={{ total: transactions.total, data: [...transactions.list] }}
        />
      ),
    },
    {
      key: 'tokentxns',
      label: 'Token Transfers',
      children: (
        <TokenTransfers
          showHeader={false}
          isMobileSSR={false}
          SSRData={{ total: transactions.total, data: [...tokenTransfers.list] }}
        />
      ),
    },
    {
      key: 'nfttransfers',
      label: 'NFT Transfers',
      children: (
        <NFTTransfers
          showHeader={false}
          isMobileSSR={false}
          SSRData={{ total: transactions.total, data: [...tokenTransfers.list] }}
        />
      ),
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
  return (
    <div className="address-detail">
      <div className="address-header">
        <HeadTitle content={title}>
          <div className="code-box">
            <span className="text-sm leading-[22px] mr-4 ml-2">{hash}</span>
            <Copy value={hash} />
            <Tooltip
              placement="bottom"
              color="white"
              getPopupContainer={(node) => node}
              trigger="click"
              title={<QrCode value={hash} />}>
              <IconFont className="text-xs cursor-pointer ml-4" type="QR-Code" />
            </Tooltip>
          </div>
        </HeadTitle>
      </div>
      <div className="address-overview flex">
        <Overview title="Overview" className="flex-1 mr-4" items={OverviewInfo} />

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
