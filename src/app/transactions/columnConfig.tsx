/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 19:38:52
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { TableDataType } from './list';
import { formatDate, splitAddress, addressFormat } from '@_utils/formatter';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import { Tooltip } from 'antd';
const chain_id = 'AELF';
export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<TableDataType> {
  return [
    {
      title: <IconFont className="text-xs" style={{ marginLeft: '6px' }} type="question-circle" />,
      width: '56px',
      dataIndex: '',
      key: 'view',
      render: () => (
        <div className="border cursor-pointer bg-white rounded border-color-divider w-6 h-6 flex justify-center items-center focus:bg-color-divider">
          <IconFont type="view" />
        </div>
      ),
    },
    {
      dataIndex: 'tx_id',
      width: 152,
      key: 'tx_id',
      title: 'Txn Hash',
      render: (text) => {
        return (
          <div className="flex items-center">
            <IconFont className="mr-1" type="question-circle-error" />
            <Link className="text-link text-xs block w-[120px] truncate leading-5" href={`Transactions/${text}`}>
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
      width: '112px',
      dataIndex: 'method',
      key: 'method',
      render: (text) => (
        <Tooltip title={text} overlayClassName="table-item-tooltip__white">
          <div className="border text-center box-border px-[15px] rounded border-D0 bg-F7 w-24 h-6 flex items-center justify-center method">
            <div className="truncate">{text}</div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Block',
      width: '96px',
      dataIndex: 'block_height',
      key: 'block_height',
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
      width: '128px',
      dataIndex: 'time',
      key: 'time',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      dataIndex: 'address_from',
      title: 'From',
      width: 196,
      render: (text) => {
        return (
          <div className="address flex items-center">
            <Tooltip title={addressFormat(text, chain_id, chain_id)} overlayClassName="table-item-tooltip__white">
              <Link className="text-link" href={`/address/${addressFormat(text, chain_id, chain_id)}`}>
                {addressFormat(splitAddress(text, 4, 4), chain_id, chain_id)}
              </Link>
            </Tooltip>
            <Copy value={addressFormat(text, chain_id, chain_id)} />
            <div className="flex items-center"></div>
          </div>
        );
      },
    },
    {
      title: '',
      width: '40px',
      dataIndex: '',
      key: 'from_to',
      render: () => <IconFont className="text-[24px]" type="fromto" />,
    },
    {
      dataIndex: 'address_to',
      title: 'To',
      width: 196,
      render: (text) => {
        return (
          <div className="address">
            <IconFont className="mr-1 text-xs" type="Contract" />
            <Tooltip title={text} overlayClassName="table-item-tooltip__white">
              <Link href={`/address/${text}`}>{text}</Link>
            </Tooltip>
            <Copy value={text} />
          </div>
        );
      },
    },
    {
      title: 'Value',
      width: '178px',
      key: 'value',
      dataIndex: 'value',
    },
    {
      title: 'Txn Fee',
      width: '178px',
      key: 'tx_fee',
      dataIndex: 'tx_fee',
      render: (text) => {
        return <span className="text-base-200">{text}</span>;
      },
    },
  ];
}
