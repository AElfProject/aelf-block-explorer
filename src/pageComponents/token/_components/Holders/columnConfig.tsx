/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:28:28
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';

import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Copy from '@_components/Copy';

import EPTooltip from '@_components/EPToolTip';
import { IHolder } from '@pageComponents/token/type';
import IconFont from '@_components/IconFont';
import { numberFormatter } from '@_utils/formatter';

export default function getColumns(): ColumnsType<IHolder> {
  return [
    {
      title: '#',
      width: '96px',
      dataIndex: 'rank',
      key: 'rank',
      render: (text) => <span className="block text-xs leading-5">{text}</span>,
    },
    {
      dataIndex: 'address',
      title: 'Address',
      width: 432,
      render: (address) => {
        return (
          <div className="flex items-center address">
            <IconFont type="Contract"></IconFont>
            <EPTooltip pointAtCenter={false} title={addressFormat(address)} mode="dark">
              <Link className="mx-1 text-link" href={`/address/${addressFormat(address)}`}>
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
      dataIndex: 'quantity',
      width: 240,
      key: 'quantity',
      title: 'Quantity',
      render: (text) => {
        return <span className="flex items-center">{numberFormatter(text, '')}</span>;
      },
    },
    {
      title: 'Percentage',
      width: 240,
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => {
        return <div>{text}%</div>;
      },
    },
    {
      title: 'Value',
      width: 240,
      dataIndex: 'value',
      key: 'value',
      render: (text) => {
        return <div className="text-xs leading-5">${numberFormatter(text, '')}</div>;
      },
    },
  ];
}
