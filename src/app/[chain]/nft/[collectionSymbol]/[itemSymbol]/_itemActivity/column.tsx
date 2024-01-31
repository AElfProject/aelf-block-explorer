/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:22:36
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { IActivityTableData } from './type';
import { formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import { Tooltip } from 'antd';
import ContractToken from '@_components/ContractToken';

export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<IActivityTableData> {
  return [
    {
      title: <IconFont type="question-circle" />,
      width: 40,
      dataIndex: '',
      key: 'view',
      render: () => (
        <div className="flex size-6 cursor-pointer items-center justify-center rounded border border-color-divider bg-white focus:bg-color-divider">
          <IconFont type="view" />
        </div>
      ),
    },
    {
      dataIndex: 'transactionHash',
      width: 224,
      key: 'transactionHash',
      title: (
        <div>
          <span>Txn Hash</span>
          <IconFont type="question-circle" />
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
      title: (
        <div
          className="time cursor-pointer font-medium text-link"
          onClick={handleTimeChange}
          onKeyDown={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      width: 224,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      title: 'Action',
      width: 112,
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        return (
          <div>
            <span>{text}</span>
            {record.action === 'Sale' && <IconFont type="view" />}
          </div>
        );
      },
    },
    {
      title: 'Price',
      width: 240,
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        return (
          record.action === 'Sales' && (
            <div>
              <span>{text}</span>
              <span>(0.2003ELF)</span>
            </div>
          )
        );
      },
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: 196,
      render: (text) => {
        const { address } = JSON.parse(text);
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
      // width: 196,
      render: (text) => {
        const { address } = JSON.parse(text);
        return <ContractToken address={address} />;
      },
    },
  ];
}
