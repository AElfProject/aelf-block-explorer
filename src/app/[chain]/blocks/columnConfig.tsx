/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:28:28
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { addSymbol, divDecimals, formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';
import Copy from '@_components/Copy';
import { IBlocksResponseItem } from '@_api/type';
export default function getColumns({ timeFormat, handleTimeChange, chianId }): ColumnsType<IBlocksResponseItem> {
  return [
    {
      title: 'Block',
      width: '96px',
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (text) => (
        <Link className="block text-xs leading-5 text-link" href={`/${chianId}/block/${text}`}>
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
      render: (text, record) => (
        <Link className="block text-xs leading-5 text-link" href={`/${chianId}/block/${record.blockHeight}#txns`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Producer',
      key: 'producerAddress',
      width: '320px',
      dataIndex: 'producerAddress',
      render: (address, record) => (
        <div className="flex items-center">
          <Link
            className="block text-xs leading-5 text-link"
            title={`${addressFormat(address, chianId)}`}
            href=""
            // href={`${chianId}/address/${addressFormat(address, chianId)}`}
          >
            {record.producerName ? record.producerName : `${addressFormat(hiddenAddress(address, 4, 4), chianId)}`}
          </Link>
          <Copy value={addressFormat(address, chianId)} />
        </div>
      ),
    },
    {
      title: 'Reward',
      width: '208px',
      key: 'reward',
      dataIndex: 'reward',
      render: (reward: string) => {
        return <>{addSymbol(divDecimals(reward))}</>;
      },
    },
    {
      title: 'Burnt Fees',
      width: '208px',
      key: 'burntFees',
      dataIndex: 'burntFees',
      render: (value: string) => {
        return <>{addSymbol(divDecimals(value))}</>;
      },
    },
  ];
}
