/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Tag } from 'antd';
import config from 'constants/config/config';
import Dividends from 'components/Dividends';
import IconFont from 'components/IconFont';
import { getFormattedDate } from 'utils/timeUtils';
import { numberFormatter } from 'utils/formater';
const { CHAIN_ID } = config;
const getColumnConfig = ({ address, isMobile, timeFormat, handleFormatChange, ellipsis = true }) => {
  return [
    {
      title: 'Txn Hash',
      width: isMobile ? 149 : 206,
      ellipsis,
      dataIndex: 'txId',
      className: 'color-blue',
      render(hash) {
        return <Link href={`/tx/${hash}`}>{hash}</Link>;
      },
    },
    {
      dataIndex: 'time',
      width: isMobile ? 156 : 190,
      title: (
        <div className="time" onClick={handleFormatChange}>
          {timeFormat} <IconFont type="change" />
        </div>
      ),
      render: (text) => {
        return <div>{getFormattedDate(text, timeFormat)}</div>;
      },
    },
    {
      title: 'From',
      dataIndex: 'from',
      width: isMobile ? 188 : 172,
      className: 'color-blue',
      render(from) {
        const isOut = from === address;
        return (
          <div className="from">
            <Link href={`/address/${from}`}>{`ELF_${from}_${CHAIN_ID}`}</Link>
            <Tag className={clsx(isOut ? 'out' : 'in')}>{isOut ? 'OUT' : 'IN'}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Interacted With (To )',
      dataIndex: 'to',
      width: isMobile ? 140 : 224,
      ellipsis,
      className: 'color-blue',
      render(to) {
        return <Link className="to" href={`/address/${to}`}>{`ELF_${to}_${CHAIN_ID}`}</Link>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: isMobile ? 96 : 150,
      render(amount, record) {
        return `${numberFormatter(amount)} ${record.symbol}`;
      },
    },
    {
      title: 'Txn Fee',
      dataIndex: 'txFee',
      align: 'right',
      width: isMobile ? 96 : 120,
      render(fee) {
        return <Dividends dividends={fee} />;
      },
    },
  ];
};

export default getColumnConfig;
