import ContractToken from '@_components/ContractToken';
import Copy from '@_components/Copy';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import TransactionsView from '@_components/TransactionsView';
import { TTransactionStatus } from '@_types/common';
import { formatDate, thousandsNumber } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { ITransferItem } from '../../type';

export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<ITransferItem> {
  return [
    {
      title: <IconFont className="ml-[6px] text-xs" type="question-circle" />,
      width: 72,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} />,
    },
    {
      title: (
        <div className="cursor-pointer font-medium">
          <span>Txn Hash</span>
          <IconFont className="ml-1" type="question-circle" />
        </div>
      ),
      width: 208,
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      render: (text, record) => (
        <div className="flex items-center">
          {record.status === TTransactionStatus.fail && <IconFont className="ml-1" type="question-circle-error" />}
          <Link className="block w-[120px] truncate text-xs leading-5 text-link" href={`tx/${text}`}>
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
          <IconFont className="ml-1" type="question-circle" />
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
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      title: 'From',
      width: 180,
      dataIndex: 'from',
      key: 'from',
      render: (text) => {
        const { address } = JSON.parse(text);
        return (
          <div className="flex items-center">
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
      title: 'To',
      dataIndex: 'to',
      width: 180,
      render: (text) => {
        const { address } = JSON.parse(text);
        return <ContractToken address={address} />;
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
