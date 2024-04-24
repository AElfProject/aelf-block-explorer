/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:22:36
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { ITableDataType } from './type';
import { formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import ContractToken from '@_components/ContractToken';
import EPTooltip from '@_components/EPToolTip';
import TransactionsView from '@_components/TransactionsView';
enum Status {
  Success = 'Success',
  fail = 'Fail',
}
export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<ITableDataType> {
  return [
    {
      title: <IconFont className="ml-[6px] text-xs" type="question-circle" />,
      width: 72,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} />,
    },
    {
      dataIndex: 'transactionId',
      width: 168,
      key: 'transactionId',
      title: 'Txn Hash',
      render: (text, records) => {
        return (
          <div className="flex items-center">
            {records.status === Status.fail && <IconFont className="mr-1" type="question-circle-error" />}
            <Link className="block w-[120px] truncate text-xs leading-5 text-link" href={`tx/${text}`}>
              {text}
            </Link>
          </div>
        );
      },
    },
    {
      title: (
        <div className="cursor-pointer font-medium text-link">
          <span>Method</span>
          <IconFont className="ml-1 text-xs" type="question-circle" />
        </div>
      ),
      width: 128,
      dataIndex: 'method',
      key: 'method',
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: 'Block',
      width: 112,
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
      width: 144,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: 196,
      render: (text) => {
        const { address } = JSON.parse(text);
        return (
          <div className="address flex items-center">
            <EPTooltip pointAtCenter={false} title={addressFormat(address)} mode="dark">
              <Link className="text-link" href={`/address/${addressFormat(address)}`}>
                {addressFormat(hiddenAddress(address, 4, 4))}
              </Link>
            </EPTooltip>
            <Copy value={addressFormat(address)} />
            <div className="flex items-center"></div>
          </div>
        );
      },
    },
    {
      title: '',
      width: 40,
      dataIndex: '',
      key: 'from_to',
      render: () => <IconFont className="text-[24px]" type="fromto" />,
    },
    {
      dataIndex: 'to',
      title: 'To',
      width: 196,
      render: (text) => {
        const { address } = JSON.parse(text);
        return <ContractToken address={address} />;
      },
    },
    {
      title: 'Value',
      width: 178,
      key: 'transactionFee',
      dataIndex: 'transactionFee',
      render: (text) => {
        return <span className="text-base-100">{text + 'ELF'}</span>;
      },
    },
    {
      title: 'Txn Fee',
      width: 178,
      key: 'transactionFee',
      dataIndex: 'transactionFee',
      render: (text) => {
        return <span className="text-base-200">{text + 'ELF'}</span>;
      },
    },
  ];
}
