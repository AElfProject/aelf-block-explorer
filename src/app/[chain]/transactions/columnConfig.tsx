/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:22:36
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { addSymbol, divDecimals, formatDate } from '@_utils/formatter';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import ContractToken from '@_components/ContractToken';
import TransactionsView from '@_components/TransactionsView';
import { ITransactionsResponseItem, TransactionStatus } from '@_api/type';
import EPTooltip from '@_components/EPToolTip';

export default function getColumns({
  timeFormat,
  handleTimeChange,
  chainId = 'AELF',
  type,
}): ColumnsType<ITransactionsResponseItem> {
  return [
    {
      title: (
        <EPTooltip title="See preview of the transaction details." mode="dark">
          <IconFont className="ml-[6px] cursor-pointer text-xs" type="question-circle" />
        </EPTooltip>
      ),
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
            {records.status === TransactionStatus.Failed && <IconFont className="mr-1" type="question-circle-error" />}
            <EPTooltip title={text} mode="dark">
              <Link
                className="block w-[120px] truncate text-xs leading-5 text-link"
                href={`/${chainId}/tx/${text}?blockHeight=${records.blockHeight}`}>
                {text}
              </Link>
            </EPTooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="cursor-pointer font-medium text-link">
          <span>Method</span>
          <EPTooltip title="Function executed based on input data. " mode="dark">
            <IconFont className="ml-1 text-xs" type="question-circle" />
          </EPTooltip>
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
      hidden: type === 'block',
      key: 'blockHeight',
      render: (text) => (
        <Link className="block text-xs leading-5 text-link" href={`/${chainId}/block/${text}`}>
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
      render: (fromData) => {
        const { address } = fromData;
        return <ContractToken address={address} name={fromData.name} chainId={chainId} type={fromData.addressType} />;
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
      render: (toData) => {
        const { address } = toData;
        return <ContractToken address={address} name={toData.name} chainId={chainId} type={toData.addressType} />;
      },
    },
    {
      title: 'Value',
      width: 178,
      key: 'transactionValue',
      dataIndex: 'transactionValue',
      render: (text) => {
        return <span className="text-base-100">{addSymbol(divDecimals(text))}</span>;
      },
    },
    {
      title: 'Txn Fee',
      width: 178,
      key: 'transactionFee',
      dataIndex: 'transactionFee',
      render: (text) => {
        return <span className="text-base-200">{addSymbol(divDecimals(text))}</span>;
      },
    },
  ];
}
