/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:46:11
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { ITableDataType } from './list';
import { numberFormatter } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';
import Copy from '@_components/Copy';
import IconFont from '@_components/IconFont';
import EPTooltip from '@_components/EPToolTip';
export default function getColumns(): ColumnsType<ITableDataType> {
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
          <EPTooltip title={addressFormat(text)} mode="dark" pointAtCenter={false}>
            <Link className="text-link" href={`/address/${addressFormat(text)}`}>
              {addressFormat(hiddenAddress(text, 4, 4))}
            </Link>
          </EPTooltip>
          <Copy value={addressFormat(text)} />
        </div>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: '394px',
      render(balance) {
        return `${numberFormatter(balance)}`;
      },
    },
    {
      title: (
        <div>
          <span>Percentage</span>
          <EPTooltip title="Percentage" mode="light">
            <IconFont className="text-xs ml-[6px]" type="question-circle" />
          </EPTooltip>
        </div>
      ),
      dataIndex: 'percentage',
      width: '224px',
    },
    {
      title: (
        <div>
          <span>Transfers</span>
          <EPTooltip title="Transfers" mode="light">
            <IconFont className="text-xs ml-[6px]" type="question-circle" />
          </EPTooltip>
        </div>
      ),
      dataIndex: 'txnCount',
      width: '224px',
    },
  ];
}
