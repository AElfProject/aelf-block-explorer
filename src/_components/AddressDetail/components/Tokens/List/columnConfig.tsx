import IconFont from '@_components/IconFont';
import { thousandsNumber } from '@_utils/formatter';
import { TokensListItemType } from '@_types/commonDetail';
import { ColumnsType } from 'antd/es/table';
import EPSortIcon from '@_components/EPSortIcon';

export default function getColumns(sortedInfo): ColumnsType<TokensListItemType> {
  return [
    {
      dataIndex: 'asset',
      width: 219,
      key: 'asset',
      title: 'Token Name',
      sorter: true,
      sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      sortOrder: sortedInfo?.columnKey === 'asset' ? sortedInfo.order : null,
      render: (text) => {
        return (
          <div className="flex items-center">
            <IconFont className="text-2xl" type="Aelf-transfer" />
            <span className="mx-1 inline-block max-w-[175px] truncate leading-5 text-base-100">{text}</span>
          </div>
        );
      },
    },
    {
      title: 'Symbol',
      width: 218,
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text) => <span className="inline-block max-w-[181px] truncate leading-5 text-base-100">{text}</span>,
    },
    {
      title: 'Quantity',
      width: 219,
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text) => (
        <span className="inline-block max-w-[124px] truncate leading-5 text-base-100">{thousandsNumber(text)}</span>
      ),
    },
    {
      title: 'Price',
      width: 274,
      dataIndex: 'priceInUsd',
      key: 'priceInUsd',
      render: (text) => <span>${thousandsNumber(text)}</span>,
    },
    {
      title: 'Change(24H)',
      width: 108,
      dataIndex: 'pricePercentChange24h',
      key: 'pricePercentChange24h',
      render: () => (
        <span className="text-rise-red">
          <IconFont className="mr-1 text-xs" type="down-aa9i0lma" />
          4.75%
        </span>
      ),
    },
    {
      title: 'Value',
      width: 274,
      dataIndex: 'totalPriceInUsd',
      key: 'totalPriceInUsd',
      render: (text) => <span>${thousandsNumber(text)}</span>,
    },
  ];
}
