import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import TokenTableCell from '@_components/TokenTableCell';
import { thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import clsx from 'clsx';
import TokenImage from './_components/TokenImage';
import { ITokensTableItem } from './type';

const getHolderPercentChange24h = (record: ITokensTableItem) => {
  const { holderPercentChange24h, holders } = record;
  const num = Number(holderPercentChange24h);
  if (Number.isNaN(num)) return '';
  if (num > 0) return `A ${num}% increase in token holders from the previous day count of ${thousandsNumber(holders)}`;
  if (num < 0) return `A ${num}% decrease in token holders from the previous day count of ${thousandsNumber(holders)}`;
  return 'No change in token holders from the previous day count';
};

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
      render: (text) => (
        <TokenTableCell token={text}>
          <TokenImage token={text} />
        </TokenTableCell>
      ),
    },
    {
      title: 'Maximum Supply',
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
          <EPTooltip mode="dark" title="Sorted in descending order Click for ascending order">
            <div className="text-link">Holder</div>
          </EPTooltip>
        </div>
      ),
      width: '208px',
      dataIndex: 'holders',
      key: 'holders',
      render: (text, record) => {
        const { holderPercentChange24h } = record;
        return (
          <div className="text-xs leading-5">
            <div>{text}</div>
            <div className={clsx(holderPercentChange24h >= 0 ? 'text-[#00A186]' : 'text-[#FF4D4F]')}>
              <EPTooltip title={getHolderPercentChange24h(record)} mode="dark">
                {holderPercentChange24h}
              </EPTooltip>
            </div>
          </div>
        );
      },
    },
  ];
}
