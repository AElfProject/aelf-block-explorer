import React from 'react';
import Link from 'next/link';
import { numberFormatter } from 'utils/formater';
import { ColumnsType } from 'antd/lib/table';
import { AlignType } from 'rc-table/lib/interface';
interface IRecord {
  title: string;
  dataIndex: string;
  width: number;
  render: (prop: any) => void;
  symbol?: string;
  align?: AlignType;
}
const getColumnConfig = (isMobile, preTotal) => {
  const columnConfig: ColumnsType<IRecord> = [
    {
      title: 'Rank',
      dataIndex: 'id',
      width: isMobile ? 82 : 196,
      render(id, record, index) {
        return preTotal + index + 1;
      },
    },
    {
      title: 'Token Name',
      dataIndex: 'symbol',
      width: isMobile ? 96 : 180,
      render(symbol) {
        return <Link href={`/token/${symbol}`}>{symbol}</Link>;
      },
    },
    {
      title: 'Total Supply',
      dataIndex: 'totalSupply',
      width: isMobile ? 156 : 230,
      render(totalSupply, record) {
        return `${numberFormatter(totalSupply)} ${record.symbol}`;
      },
    },
    {
      title: 'Circulating Supply',
      dataIndex: 'supply',
      width: isMobile ? 156 : 260,
      render(supply, record) {
        return `${numberFormatter(supply)} ${record.symbol}`;
      },
    },
    {
      title: 'Holders',
      dataIndex: 'holders',
      width: isMobile ? 76 : 120,
    },
    {
      title: 'Transfers',
      align: 'right',
      dataIndex: 'transfers',
      width: isMobile ? 76 : 86,
    },
  ];
  return columnConfig;
};

export default getColumnConfig;
