/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:57:13
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 17:02:47
 * @Description: BlockList
 */
'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { isMobileDevices } from '@_utils/isMobile';
import fetchData from './mock';

export interface TableDataType {
  blockHeight: number;
  timestamp: string;
  txns: number;
  Producer: {
    name: string;
    chain_id: string;
  };
  blockHash?: string;
  reward: string;
  burntFee: string;
}

export default function BlockList({ isMobileSSR, SSRData }) {
  const [isMobile, setIsMobile] = useState(isMobileSSR);
  useEffect(() => {
    setIsMobile(isMobileDevices());
  }, []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const [data, setData] = useState<TableDataType[]>(SSRData.blocks);
  const handleTimeChange = () => {
    if (timeFormat === 'Age') {
      setTimeFormat('Date Time (UTC)');
    } else {
      setTimeFormat('Age');
    }
  };
  const columns = useMemo<ColumnsType<TableDataType>>(() => {
    return getColumns({ timeFormat, handleTimeChange });
  }, [timeFormat]);

  const pageChange = async (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    const data = await fetchData({ page, pageSize: pageSize });
    setData(data.blocks);
    setTotal(data.total);
    setLoading(false);
  };
  const multiTitle = useMemo(() => {
    return `A total of ${total} transactions found`;
  }, [total]);

  const pageSizeChange = async (size) => {
    setLoading(true);
    setPageSize(size);
    setCurrentPage(1);
    const data = await fetchData({ page: 1, pageSize: size });
    setData(data.blocks);
    setTotal(data.total);
    setLoading(false);
  };
  return (
    <div>
      <HeadTitle content="Blocks"></HeadTitle>
      <Table
        titleType="multi"
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="blockHeight"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
        multiTitle={multiTitle}
        multiTitleDesc="(Showing blocks between #17785761 to #17785785)"></Table>
    </div>
  );
}
