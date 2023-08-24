'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from '@_components/TokenTransfers/columnConfig';
import { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { isMobileDevices } from '@_utils/isMobile';
import { TokenTransfersItemType } from '@_types/commenDetail';
import fetchData from './mock';
import { numberFormatter } from '@_utils/formatter';

export default function List({ isMobileSSR, SSRData, showHeader = true }) {
  const [isMobile, setIsMobile] = useState(isMobileSSR);
  useEffect(() => {
    setIsMobile(isMobileDevices());
  }, []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<TokenTransfersItemType[]>(SSRData.data);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<TokenTransfersItemType>>(() => {
    return getColumns({
      timeFormat,
      columnType: 'NFT',
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const singleTitle = useMemo(() => {
    return `A total of ${numberFormatter(String(total))} NFT transfers found`;
  }, [total]);

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
      {showHeader && <HeadTitle content="Transactions"></HeadTitle>}
      <Table
        titleType="single"
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
        singleTitle={singleTitle}></Table>
    </div>
  );
}
