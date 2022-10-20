import Link from 'next/link';
import React from 'react';
import { numberFormatter } from 'utils/formater';
import { ColumnType } from 'antd/es/table';
interface IRecord {
  balance?: string;
  symbol: string;
}
export default ({ prices, isMobile }) => {
  const column: ColumnType<IRecord>[] = [
    {
      title: 'Token Name',
      dataIndex: 'symbol',
      width: isMobile ? 94 : 376,
      render(symbol) {
        return symbol ? <Link href={`/token/${symbol}`}>{symbol}</Link> : '-';
      },
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: isMobile ? 90 : 356,
      render(balance) {
        return numberFormatter(balance);
      },
    },
    {
      title: 'Token Price',
      dataIndex: 'symbol',
      width: isMobile ? 70 : 300,
      render(symbol) {
        if (symbol && prices) return prices[symbol] ? `$${numberFormatter(prices[symbol])}` : '-';
        return '-';
      },
    },
    {
      title: 'Value in USD',
      dataIndex: 'symbol',
      align: 'right',
      width: isMobile ? 70 : 136,
      render(symbol, record) {
        if (symbol && prices) return prices[symbol] ? `$${numberFormatter(prices[symbol] * +record.balance!)}` : '-';
        return '-';
      },
    },
  ];
  return column;
};
