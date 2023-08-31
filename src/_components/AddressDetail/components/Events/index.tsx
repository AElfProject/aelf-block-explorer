import Table from '@_components/Table';
import { useMemo, useState } from 'react';
import { IEvents } from './type';
import { ColumnsType } from 'antd/es/table';
import fetchData from './mock';
import getColumns from './columnConfig';
import './index.css';
import { useDebounce, useEffectOnce } from 'react-use';
import EPSearch from '@_components/EPSearch';
import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';

export default function Events({ SSRData = { total: 0, list: [] } }) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IEvents[]>(SSRData.list);
  const [timeFormat, setTimeFormat] = useState<string>('Date Time (UTC)');
  const [searchText, setSearchText] = useState<string>('');
  useEffectOnce(() => {
    async function getData() {
      setLoading(true);
      const data = await fetchData({ page: currentPage, pageSize: pageSize });
      setData(data.list);
      setTotal(data.total);
      setLoading(false);
    }
    getData();
  });
  const columns = useMemo<ColumnsType<IEvents>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const pageChange = async (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    const data = await fetchData({ page, pageSize: pageSize });
    setData(data.list);
    setTotal(data.total);
    setLoading(false);
  };

  const pageSizeChange = async (size) => {
    setLoading(true);
    setPageSize(size);
    setCurrentPage(1);
    const data = await fetchData({ page: 1, pageSize: size });
    setData(data.list);
    setTotal(data.total);
    setLoading(false);
  };
  const searchChange = async () => {
    setLoading(true);
    setCurrentPage(1);
    const data = await fetchData({ page: 1, pageSize: pageSize });
    setData(data.list);
    setTotal(data.total);
    setLoading(false);
  };
  useDebounce(
    () => {
      searchChange();
    },
    300,
    [searchText],
  );

  const { isMobileSSR: isMobile } = useMobileContext();

  return (
    <div className="event-container">
      <div className={clsx('event-header', isMobile && 'flex-col !items-start')}>
        <div className="tips">
          Tips：Contract events are developer-defined mechanisms that allow users to observe and understand specific
          operations within a contract. These operations can include changes in state, user interactions, and important
          notifications. By examining events, users can gain valuable insights into the contract&apos;s internal
          workings, including event names, parameters, transaction hashes, block numbers, and other pertinent data.
        </div>
        <div className={clsx('search-box', isMobile && 'mt-2')}>
          <EPSearch
            value={searchText}
            onChange={({ currentTarget }) => {
              setSearchText(currentTarget.value);
            }}
          />
        </div>
      </div>
      <Table
        titleType="multi"
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="id"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
