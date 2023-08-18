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
import { Tooltip } from 'antd';
import Method from '@_components/Method';
import ContractToken from '@_components/ContractToken';
enum Status {
  Success = 'Success',
  fail = 'Fail',
}
export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<ITableDataType> {
  return [
    {
      title: <IconFont className="text-xs" style={{ marginLeft: '6px' }} type="question-circle" />,
      width: 72,
      dataIndex: '',
      key: 'view',
      render: () => (
        <div className="border cursor-pointer bg-white rounded border-color-divider w-6 h-6 flex justify-center items-center focus:bg-color-divider">
          <IconFont type="view" />
        </div>
      ),
    },
    {
      dataIndex: 'transactionHash',
      width: 168,
      key: 'transactionHash',
      title: 'Txn Hash',
      render: (text, records) => {
        return (
          <div className="flex items-center">
            {records.status === Status.fail && <IconFont className="mr-1" type="question-circle-error" />}
            <Link className="text-link text-xs block w-[120px] truncate leading-5" href={`tx/${text}`}>
              {text}
            </Link>
          </div>
        );
      },
    },
    {
      title: (
        <div className="text-link cursor-pointer font-medium">
          <span>Method</span>
          <IconFont className="text-xs" style={{ marginLeft: '4px' }} type="question-circle" />
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
        const { address } = text;
        return (
          <div className="address flex items-center">
            <Tooltip title={addressFormat(address)} overlayClassName="table-item-tooltip-white">
              <Link className="text-link" href={`/address/${addressFormat(address)}`}>
                {addressFormat(hiddenAddress(address, 4, 4))}
              </Link>
            </Tooltip>
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
        return <ContractToken address={text.address} />;
      },
    },
    {
      title: 'Value',
      width: 178,
      key: 'txnValue',
      dataIndex: 'txnValue',
      render: (text) => {
        return <span className="text-base-100">{text + 'ELF'}</span>;
      },
    },
    {
      title: 'Txn Fee',
      width: 178,
      key: 'txnFee',
      dataIndex: 'txnFee',
      render: (text) => {
        return <span className="text-base-200">{text + 'ELF'}</span>;
      },
    },
  ];
}
