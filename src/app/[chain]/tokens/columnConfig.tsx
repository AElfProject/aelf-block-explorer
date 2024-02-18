import { ColumnsType } from 'antd/es/table';
import { ITokensTableItem } from './type';
import TokenCell from './_components/TokenCell';
import { thousandsNumber } from '@_utils/formatter';
import IconFont from '@_components/IconFont';
import clsx from 'clsx';

export default function getColumns({ currentPage, pageSize, ChangeOrder }): ColumnsType<ITokensTableItem> {
  return [
    {
      title: '#',
      width: '96px',
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Token',
      width: '432px',
      dataIndex: 'token',
      key: 'token',
      render: (text) => <TokenCell token={text} />,
    },
    {
      title: 'Total Supply',
      width: '320px',
      dataIndex: 'totalSupply',
      key: 'totalSupply',
      render: (text) => thousandsNumber(text),
    },
    {
      title: 'Circulating Supply',
      width: '208px',
      dataIndex: 'circulatingSupply',
      key: 'circulatingSupply',
      render: (text) => thousandsNumber(text),
    },
    {
      title: (
        <div className="flex cursor-pointer" onClick={ChangeOrder}>
          <IconFont className="mr-1 text-xs" type="Rank" />
          <div className="text-link">Holders</div>
        </div>
      ),
      width: '208px',
      dataIndex: 'holders',
      key: 'holders',
      // sorter: (a, b) => a.holders - b.holders,
      // sortOrder: sortedInfo.columnKey === 'holders' ? sortedInfo.order : null,
      render: (text, record) => {
        const { holderPercentChange24h } = record;
        return (
          <div className="text-xs leading-5">
            <div>{text}</div>
            <div className={clsx(holderPercentChange24h >= 0 ? 'text-[#00A186]' : 'text-[#FF4D4F]')}>
              {holderPercentChange24h}
            </div>
          </div>
        );
      },
    },
  ];
}
