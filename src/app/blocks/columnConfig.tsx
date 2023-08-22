/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:28:28
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { TableDataType } from './blockList';
import { formatDate, splitAddress, addressFormat } from '@_utils/formatter';
import Link from 'next/link';
import Copy from '@_components/Copy';
export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<TableDataType> {
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
      render: ({ name, chain_id }) => (
        <div className="flex items-center">
          <Link
            className="text-link text-xs block leading-5"
            title={`${addressFormat(name, chain_id, chain_id)}`}
            href={`/address/${addressFormat(name, chain_id, chain_id)}`}>{`${addressFormat(
            splitAddress(name, 4, 4),
            chain_id,
            chain_id,
          )}`}</Link>
          <Copy value={addressFormat(name, chain_id, chain_id)} />
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
