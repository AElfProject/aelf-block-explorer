import ContractToken from '@_components/ContractToken';
import { thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import { IHolderItem } from '../../type';

export default function getColumns({ currentPage, pageSize, chain }): ColumnsType<IHolderItem> {
  return [
    {
      title: '#',
      width: 112,
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Address',
      width: 432,
      dataIndex: 'address',
      key: 'address',
      render: (data) => {
        const { address, addressType } = data;
        return <ContractToken address={address} type={addressType} chainId={chain} />;
      },
    },
    {
      title: 'Quantity',
      width: 240,
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text) => thousandsNumber(text),
    },
    {
      title: 'Percentage',
      width: 240,
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => thousandsNumber(text) + '%',
    },
    {
      title: 'Value',
      width: 240,
      dataIndex: 'value',
      key: 'value',
      render: (text) => '$' + thousandsNumber(text),
    },
  ];
}
