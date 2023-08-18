/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:46:11
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { TableDataType } from './list';
import { splitAddress, addressFormat, numberFormatter } from '@_utils/formatter';
import Link from 'next/link';
import Copy from '@_components/Copy';
import { Tooltip } from 'antd';
import IconFont from '@_components/IconFont';
const chain_id = 'AELF';
const symbol = 'ELF';
export default function getColumns(): ColumnsType<TableDataType> {
  return [
    {
      title: '#',
      dataIndex: 'rank',
      width: '112px',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '394px',
      render: (text) => (
        <div className="address">
          <IconFont className="mr-1 text-xs" type="Contract" />
          <Tooltip title={addressFormat(text, chain_id, chain_id)} overlayClassName="table-item-tooltip__white">
            <Link className="text-link" href={`/address/${addressFormat(text, chain_id, chain_id)}`}>
              {addressFormat(splitAddress(text, 8, 8), chain_id, chain_id)}
            </Link>
          </Tooltip>
          <Copy value={addressFormat(text, chain_id, chain_id)} />
        </div>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: '394px',
      render(balance) {
        return `${numberFormatter(balance)} ${symbol}`;
      },
    },
    {
      title: (
        <div>
          <span>Percentage</span>
          <Tooltip title="Percentage" overlayClassName="table-item-tooltip__white">
            <IconFont className="text-xs" style={{ marginLeft: '6px' }} type="question-circle" />
          </Tooltip>
        </div>
      ),
      dataIndex: 'percentage',
      width: '224px',
    },
    {
      title: (
        <div>
          <span>Transfers</span>
          <Tooltip title="Transfers" overlayClassName="table-item-tooltip__white">
            <IconFont className="text-xs" style={{ marginLeft: '6px' }} type="question-circle" />
          </Tooltip>
        </div>
      ),
      dataIndex: 'txnCount',
      width: '224px',
    },
  ];
}
