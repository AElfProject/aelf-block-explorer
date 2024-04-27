import ContractToken from '@_components/ContractToken';
import Copy from '@_components/Copy';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import TransactionsView from '@_components/TransactionsView';
import { TTransactionStatus } from '@_types/common';
import { formatDate, thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { ITransferItem } from '../../type';

export default function getColumns({ timeFormat, handleTimeChange, chain }): ColumnsType<ITransferItem> {
  return [
    {
      title: (
        <EPTooltip mode="dark" title="See preview of the transaction details.">
          <IconFont className="ml-[6px] text-xs" type="question-circle" />
        </EPTooltip>
      ),
      width: 72,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} />,
    },
    {
      title: (
        <div className="cursor-pointer font-medium">
          <span>Txn Hash</span>
          <EPTooltip
            mode="dark"
            title="A TxHash or transaction hash is a unique 64 character identifier that is generated whenever a transaction is executed.">
            <IconFont className="ml-1" type="question-circle" />
          </EPTooltip>
        </div>
      ),
      width: 208,
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text, record) => (
        <div className="flex items-center">
          {record.status === TTransactionStatus.fail && <IconFont className="ml-1" type="question-circle-error" />}
          <Link
            className="block text-xs leading-5 text-link"
            href={`/${chain}/tx/${text}?blockHeight=${record.blockHeight}`}>
            {text}
          </Link>
          <Copy value={text} />
        </div>
      ),
    },
    {
      title: (
        <div className="cursor-pointer font-medium">
          <span>Method</span>
          <EPTooltip mode="dark" title="Function executed based on input data.">
            <IconFont className="ml-1" type="question-circle" />
          </EPTooltip>
        </div>
      ),
      width: 168,
      dataIndex: 'method',
      key: 'method',
      render: (text) => <Method text={text} tip={text} />,
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
      width: 208,
      dataIndex: 'blockTime',
      key: 'blockTime',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      title: 'From',
      width: 180,
      dataIndex: 'from',
      key: 'from',
      render: (data) => {
        const { address, addressType } = data;
        return <ContractToken address={address} type={addressType} chainId={chain} />;
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
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      width: 180,
      render: (data) => {
        const { address, addressType } = data;
        return <ContractToken address={address} type={addressType} chainId={chain} />;
      },
    },
    {
      title: 'Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      width: 224,
      render: (text) => thousandsNumber(text),
    },
  ];
}
