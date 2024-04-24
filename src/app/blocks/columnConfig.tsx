/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:28:28
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';
import Copy from '@_components/Copy';
import { IBlocksResponseItem } from '@_api/type';
export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<IBlocksResponseItem> {
  return [
    {
      title: 'Block',
      width: '96px',
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (text) => (
        <Link className="block text-xs leading-5 text-link" href={`block/${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: (
        <div
          className="time cursor-pointer font-medium text-link"
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
      key: 'transactionCount',
      dataIndex: 'transactionCount',
      render: (text) => (
        <Link className="block text-xs leading-5 text-link" href={`Transactions/${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Producer',
      key: 'producerAddress',
      width: '320px',
      dataIndex: 'producerAddress',
      render: (name) => (
        <div className="flex items-center">
          <Link
            className="block text-xs leading-5 text-link"
            title={`${addressFormat(name)}`}
            href=""
            // href={`/address/${addressFormat(name)}`}
          >
            {`${addressFormat(hiddenAddress(name, 4, 4))}`}
          </Link>
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
