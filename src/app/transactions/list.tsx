'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { isMobileDevices } from '@_utils/isMobile';
import { ITableDataType } from './type';
import fetchData from './mock';

export default function List({ isMobileSSR, SSRData }) {
  const [isMobile, setIsMobile] = useState(isMobileSSR);
  useEffect(() => {
    setIsMobile(isMobileDevices());
  }, []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ITableDataType[]>(SSRData.data);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<ITableDataType>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const multiTitle = useMemo(() => {
    return `More than > ${total} transactions found`;
  }, [total]);

  const multiTitleDesc = useMemo(() => {
    return `Showing the last 500k records`;
  }, []);

  const pageChange = async (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    const data = await fetchData({ page, pageSize: pageSize });
    setData(data.data);
    setTotal(data.total);
    setLoading(false);
  };

  const pageSizeChange = async (size) => {
    setLoading(true);
    setPageSize(size);
    setCurrentPage(1);
    const data = await fetchData({ page: 1, pageSize: size });
    setData(data.data);
    setTotal(data.total);
    setLoading(false);
  };
  return (
    <div>
      <HeadTitle content="Transactions"></HeadTitle>
      <Table
        titleType="multi"
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
        multiTitle={multiTitle}
        multiTitleDesc={multiTitleDesc}></Table>
    </div>
  );
}
