import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import { formatDate } from '@_utils/formatter';
import Link from 'next/link';
import { IEvents } from './type';
import { ColumnsType } from 'antd/es/table';
import LogItems from '@_components/LogsContainer/logItems';

export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<IEvents> {
  return [
    {
      dataIndex: 'txnHash',
      width: 208,
      key: 'txnHash',
      title: (
        <div className="flex items-center font-medium">
          <span>Txn Hash</span>
          <IconFont className="text-xs ml-1" type="question-circle" />
        </div>
      ),
      render: (text) => {
        return (
          <div className="flex items-center">
            <Link className="text-link text-xs block w-[120px] truncate leading-5" href={`tx/${text}`}>
              {text}
            </Link>
          </div>
        );
      },
    },
    {
      title: 'Block',
      width: 128,
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (text) => (
        <Link className="text-link text-xs block leading-5" href={`block/${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: (
        <div
          className="time flex items-center text-link cursor-pointer font-medium"
          onClick={handleTimeChange}
          onKeyDown={handleTimeChange}>
          <IconFont className="text-xs mr-1" type="Rank" />
          {timeFormat}
        </div>
      ),
      width: 208,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      title: 'Method',
      width: 128,
      dataIndex: 'method',
      key: 'method',
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: (
        <div>
          <IconFont className="text-xs leading-5 mr-1" type="log" />
          <span>Logs</span>
        </div>
      ),
      width: 672,
      dataIndex: 'logs',
      key: 'logs',
      render: (text) => <LogItems data={text} />,
    },
  ];
}
