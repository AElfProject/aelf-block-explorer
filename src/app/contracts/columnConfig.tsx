/*
 * @author: Peterbjx
 * @Date: 2023-08-15 14:59:06
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:50:05
 * @Description: columns
 */
import { ColumnsType } from 'antd/es/table';
import { TableDataType } from './contractsList';
import { formatDate, splitAddress, addressFormat, validateVersion } from '@_utils/formatter';
import Link from 'next/link';
import Copy from '@_components/Copy';
import IconFont from '@_components/IconFont';
export default function getColumns(): ColumnsType<TableDataType> {
  return [
    {
      title: 'Address',
      width: 208,
      dataIndex: 'address',
      key: 'address',
      render: (text) => (
        <div className="flex items-center">
          <IconFont className="mr-1 text-xs" type="Contract" />
          <Link className="text-link text-xs block leading-5" href={`block/${text}`}>
            {splitAddress(addressFormat(text, 'AELF', 'AELF'), 9, 9)}
          </Link>
          <Copy value={addressFormat(text, 'AELF', 'AELF')} />
        </div>
      ),
    },
    {
      title: 'Contract Name',
      width: 208,
      dataIndex: 'contractName',
      key: 'contractName',
    },
    {
      title: 'Type',
      width: 152,
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      width: 152,
      render(version) {
        return validateVersion(version) ? `V ${version}` : '-';
      },
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: 208,
    },
    {
      title: 'Txns',
      width: 96,
      key: 'txns',
      dataIndex: 'txns',
    },
    {
      title: <div className="time cursor-pointer">Last Updated At (+UTC)</div>,
      width: 208,
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      render: (text) => {
        return <div className="text-xs leading-5">{`${formatDate(text, 'Date Time (UTC)')} PM`}</div>;
      },
    },
  ];
}
