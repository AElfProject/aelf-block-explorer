/*
 * @author: Peterbjx
 * @Date: 2023-08-15 14:57:42
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 17:02:19
 * @Description: contract list
 */
'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { isMobileDevices } from '@_utils/isMobile';
import fetchData from './mock';

export interface ITableDataType {
  address: string;
  contractName: string;
  type: string;
  version: string;
  balance: string;
  txns: number;
  lastUpdateTime: string;
}

export default function List({ isMobileSSR, SSRData }) {
  const [isMobile, setIsMobile] = useState(isMobileSSR);
  useEffect(() => {
    setIsMobile(isMobileDevices());
  }, []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ITableDataType[]>(SSRData.data);
  const columns = useMemo<ColumnsType<ITableDataType>>(() => {
    return getColumns();
  }, []);

  const multiTitle = useMemo(() => {
    return `A total of ${total} contracts found`;
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
      <HeadTitle content="Contracts"></HeadTitle>
      <Table
        titleType="multi"
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="address"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
        multiTitle={multiTitle}
        multiTitleDesc="(Showing the last 1,000 contracts only)"></Table>
    </div>
  );
}
