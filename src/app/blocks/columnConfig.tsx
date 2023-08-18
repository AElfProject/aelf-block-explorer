/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:28:28
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { ITableDataType } from './blockList';
import { formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';
import Copy from '@_components/Copy';
export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<ITableDataType> {
  return [
    {
      title: 'Block',
      width: '96px',
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (text) => (
        <Link className="text-link text-xs block leading-5" href={`block/${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: (
        <div
          className="time text-link cursor-pointer font-medium"
          onClick={handleTimeChange}
          onKeyDown={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      width: '208px',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      title: 'Txn',
      width: '208px',
      key: 'txns',
      dataIndex: 'txns',
      render: (text) => (
        <Link className="text-link text-xs block leading-5" href={`Transactions/${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Producer',
      key: 'Producer',
      width: '320px',
      dataIndex: 'Producer',
      render: ({ name }) => (
        <div className="flex items-center">
          <Link
            className="text-link text-xs block leading-5"
            title={`${addressFormat(name)}`}
            href={`/address/${addressFormat(name)}`}>{`${addressFormat(hiddenAddress(name, 4, 4))}`}</Link>
          <Copy value={addressFormat(name)} />
        </div>
      ),
    },
    {
      title: 'Reward',
      width: '208px',
      key: 'reward',
      dataIndex: 'reward',
    },
    {
      title: 'Burnt Fees',
      width: '208px',
      key: 'burntFee',
      dataIndex: 'burntFee',
    },
  ];
}
