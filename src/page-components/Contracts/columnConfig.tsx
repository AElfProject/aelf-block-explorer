import { Tag } from 'antd';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import AddressLink from 'components/AddressLink';
import { ColumnsType } from 'antd/lib/table';
interface IRecord {
  title: string;
  dataIndex: string;
  ellipsis: boolean;
  width: number;
  render(name: any): any;
  align?: 'left' | 'right' | 'center';
}
export default ({ isMobile }) => {
  const columns: ColumnsType<IRecord> = [
    {
      title: 'Address',
      dataIndex: 'address',
      width: isMobile ? 232 : 320,
      ellipsis: true,
      render: (address) => <AddressLink address={address} />,
    },
    {
      title: 'Contract Name',
      dataIndex: 'contractName',
      ellipsis: true,
      width: isMobile ? 126 : 220,
      render(name) {
        return name === '-1' ? '-' : name;
      },
    },
    {
      title: 'Type',
      dataIndex: 'isSystemContract',
      width: isMobile ? 110 : 230,
      render(isSystem) {
        return <Tag className={clsx(isSystem ? 'system' : 'user')}>{isSystem ? 'System' : 'User'}</Tag>;
      },
    },
    {
      title: 'Version',
      dataIndex: 'version',
      width: isMobile ? 66 : 142,
    },
    {
      title: 'Last Updated At',
      width: isMobile ? 166 : 160,
      align: 'right',
      dataIndex: 'updateTime',
      render(time) {
        return <div suppressHydrationWarning>{moment(time).format('yyyy-MM-DD HH:mm:ss')}</div>;
      },
    },
  ];
  return columns;
};
