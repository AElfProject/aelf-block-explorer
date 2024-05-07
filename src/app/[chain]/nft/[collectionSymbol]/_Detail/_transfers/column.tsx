import { Button } from 'aelf-design';
import { ColumnsType } from 'antd/es/table';
import { CollectionTransfer, CollectionTransferItemProperty } from '../type';
import { formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import { Tooltip } from 'aelf-design';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import TransactionsView from '@_components/TransactionsView';
import EPTooltip from '@_components/EPToolTip';

export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<CollectionTransfer> {
  return [
    {
      title: (
        <EPTooltip title="See preview of the transaction details." mode="dark">
          <IconFont className="ml-[6px] cursor-pointer text-xs" type="question-circle" />
        </EPTooltip>
      ),
      width: 56,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} />,
    },
    {
      dataIndex: 'transactionHash',
      width: 168,
      key: 'transactionHash',
      title: (
        <div>
          <span>Txn Hash</span>
          <IconFont type="question-circle" className="ml-1" />
        </div>
      ),
      render: (text) => {
        return (
          <div className="flex items-center">
            <Link className="block w-[120px] truncate text-xs leading-5 text-link" href={`tx/${text}`}>
              {text}
            </Link>
          </div>
        );
      },
    },
    {
      dataIndex: 'method',
      width: 128,
      key: 'method',
      title: (
        <div>
          <span>Method</span>
          <IconFont type="question-circle" className="ml-1" />
        </div>
      ),
      render: (text) => {
        return (
          <div className="flex items-center">
            <Button className="method-button">
              <span className="truncate">{text}</span>
            </Button>
          </div>
        );
      },
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
      width: 160,
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
      render: (from) => {
        const { address } = from;
        const formatAddress = addressFormat(address);
        return (
          <div className="address flex items-center">
            <Tooltip title={formatAddress} overlayClassName="table-item-tooltip-white">
              <Link className="text-link" href={`/address/${formatAddress}`}>
                {addressFormat(hiddenAddress(address, 4, 4))}
              </Link>
            </Tooltip>
            <Copy value={formatAddress} />
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
      render: (to) => {
        const { address } = to;
        return <ContractToken address={address} type={AddressType.address} chainId="AELF" />;
      },
    },
    {
      title: 'Value',
      width: 192,
      dataIndex: 'value',
      key: 'value',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Item',
      width: 224,
      dataIndex: 'item',
      key: 'item',
      render: (item: CollectionTransferItemProperty) => (
        <div className="collection-transfer-item">
          <div className="mr-[4px] size-[40px] rounded-lg">
            <img src={item.imageUrl} alt="" />
          </div>
          <div>
            <div className="name h-[20px] w-[140px] truncate leading-[20px]">{item.name}</div>
            <div className="symbol h-[18px] w-[124px] truncate leading-[20px]">{item.symbol}</div>
          </div>
        </div>
      ),
    },
  ];
}
