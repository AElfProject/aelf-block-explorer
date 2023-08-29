import IconFont from '@_components/IconFont';
import { formatDate, thousandsNumber } from '@_utils/formatter';
import { NftsItemType } from '@_types/commonDetail';
import { ColumnsType } from 'antd/es/table';

export default function getColumns(): ColumnsType<NftsItemType> {
  return [
    {
      dataIndex: 'item',
      width: 235,
      key: 'item',
      title: 'Item',
      render: () => {
        return (
          <div className="item-container flex items-center">
            <div className="nft-img bg-base-200 rounded-lg w-10 h-10 mr-1"></div>
            <div className="info">
              <div className="name max-w-[175px] truncate text-xs leading-5 text-base-100">
                Unisocks.Fi - Genesis AirGenesis Air
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Collection',
      width: 421,
      dataIndex: 'collection',
      key: 'collection',
      render: (text) => (
        <div className="flex items-center">
          <span className="inline-block leading-5 max-w-[194px] text-link truncate mx-1">
            The Source by Camille Roux x MattThe Source by Camille Roux x Mat
          </span>
          <span className="flex items-center text-base-200">
            (
            <span className="inline-block leading-5 max-w-[146px] text-base-200 truncate mx-1">
              The Source by Camille RThe Source by Camille R
            </span>
            )
          </span>
        </div>
      ),
    },
    {
      title: 'Quantity',
      width: 328,
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text) => (
        <span className="inline-block leading-5 max-w-[124px] text-base-100 truncate mx-1">
          {thousandsNumber(text)}
        </span>
      ),
    },
    {
      title: 'Acquired_Since_Time',
      width: 328,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => (
        <span className="inline-block leading-5 text-base-100 mx-1">
          {formatDate(text, 'Date Time (UTC)', 'YYYY-MM-DD HH:mm:ss A')}
        </span>
      ),
    },
  ];
}
