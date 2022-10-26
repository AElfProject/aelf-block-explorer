import React from 'react';
import AddressLink from 'components/AddressLink';
import { numberFormatter } from 'utils/formater';
import { ColumnsType } from 'antd/lib/table';
interface IRecord {
  balance: string;
  count: boolean;
  owner: string;
  percentage: string;
  symbol: string;
}
export default ({ isMobile, preTotal }) => {
  const columns: ColumnsType<IRecord> = [
    {
      title: 'Rank',
      dataIndex: 'id',
      width: isMobile ? 86 : 186,
      render(id, record, index) {
        return preTotal + index + 1;
      },
    },
    {
      title: 'Address',
      dataIndex: 'owner',
      width: isMobile ? 216 : 320,
      ellipsis: true,
      className: 'color-blue',
      render: (address) => <AddressLink address={address} />,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: isMobile ? 156 : 300,
      render(balance, record) {
        return `${numberFormatter(balance)} ${record.symbol}`;
      },
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      width: isMobile ? 126 : 182,
    },
    {
      title: 'Transfers',
      dataIndex: 'count',
      align: 'right',
      width: isMobile ? 76 : 100,
    },
  ];
  return columns;
};