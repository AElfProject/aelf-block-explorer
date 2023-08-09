/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:57:13
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 20:15:10
 * @Description: BlockList
 */
'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { isMobileDevices } from '@_utils/isMobile';

export interface TableDataType {
  key: string | number;
  balance: string;
  count: number;
  percentage: string;
  symbol: string;
  owner: string;
}

const data: TableDataType[] = [
  {
    key: '1',
    balance: '277482680.46581',
    count: 32,
    owner: '25CuX2FXDvhaj7etTpezDQDunk5xGhytxE68yTYJJfMkQwvj5p',
    percentage: '27.7483%',
    symbol: 'ELF',
  },
  {
    key: '2',
    balance: '277482680.46581',
    count: 32,
    owner: '25CuX2FXDvhaj7etTpezDQDunk5xGhytxE68yTYJJfMkQwvj5p',
    percentage: '27.7483%',
    symbol: 'ELF',
  },
  {
    key: '3',
    balance: '277482680.46581',
    count: 32,
    owner: '25CuX2FXDvhaj7etTpezDQDunk5xGhytxE68yTYJJfMkQwvj5p',
    percentage: '27.7483%',
    symbol: 'ELF',
  },
];

export default function List({ isMobileSSR }) {
  const [isMobile, setIsMobile] = useState(isMobileSSR);
  useEffect(() => {
    setIsMobile(isMobileDevices());
  }, []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(101);
  const multiTitle = useMemo(() => {
    return `A total of 1,999,999 accounts found (${total} ELF)`;
  }, [total]);

  const multiTitleDesc = useMemo(() => {
    return '(Showing the top 10,000 accounts only)';
  }, []);
  const columns = useMemo<ColumnsType<TableDataType>>(() => {
    return getColumns({ preTotal: Number(pageSize) * (currentPage - 1) });
  }, [currentPage, pageSize]);

  const pageChange = (page: number, pageSize?: number) => {
    console.log(page, pageSize, 'blocks');
    setCurrentPage(page);
  };

  const pageSizeChange = (size) => {
    console.log(size, 'size blocks');
    setPageSize(size);
  };
  return (
    <div>
      <HeadTitle content="Top Accounts by ELF Balance"></HeadTitle>
      <Table
        titleType="multi"
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="key"
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
