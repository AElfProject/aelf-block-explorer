/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:22:36
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { Address, HolderItem } from '../type';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import { Tooltip } from 'antd';

export default function getColumns(): ColumnsType<HolderItem> {
  return [
    {
      title: <span>Rank</span>,
      width: 40,
      dataIndex: 'rank',
      key: 'rank',
      render: (text) => <span>{text}</span>,
    },
    {
      dataIndex: 'address',
      width: 224,
      key: 'address',
      title: (
        <div>
          <span>Address</span>
        </div>
      ),
      render: (address: Address) => {
        const { name } = address;
        return (
          <div className="address flex items-center">
            <IconFont className="mr-1 text-xs" type="Contract" />
            <Tooltip title={addressFormat(name)} overlayClassName="table-item-tooltip-white">
              <Link className="text-link" href={`/address/${addressFormat(name)}`}>
                {addressFormat(hiddenAddress(name, 4, 4))}
              </Link>
            </Tooltip>
            <Copy value={addressFormat(name)} />
          </div>
        );
      },
    },
    {
      title: <span>Quantity</span>,
      width: 40,
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => <span>{quantity}</span>,
    },
    {
      title: <span>Percentage</span>,
      width: 40,
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => <span>{percentage}</span>,
    },
  ];
}
