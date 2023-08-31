/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:57:13
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:44:31
 * @Description: BlockList
 */
'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useMemo } from 'react';
import { ColumnsType } from 'antd/es/table';
import fetchData from './mock';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';

export interface ITableDataType {
  rank: number;
  balance: string;
  txnCount: number;
  percentage: string;
  address: string;
}

export interface IResponseData {
  total: number;
  data: ITableDataType[];
}

export default function List({ SSRData }) {
  const { isMobileSSR: isMobile } = useMobileContext();
  const disposeData = (data) => {
    return {
      total: data.total,
      list: [...data.data],
    };
  };
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    ITableDataType,
    IResponseData
  >({
    SSRData: disposeData(SSRData),
    fetchData: fetchData,
    disposeData: disposeData,
  });
  const multiTitle = useMemo(() => {
    return `A total of ${total} accounts found (${total} ELF)`;
  }, [total]);

  const multiTitleDesc = useMemo(() => {
    return '(Showing the top 10,000 accounts only)';
  }, []);
  const columns = useMemo<ColumnsType<ITableDataType>>(() => {
    return getColumns();
  }, []);

  return (
    <div>
      <HeadTitle content="Top Accounts by ELF Balance"></HeadTitle>
      <Table
        titleType="multi"
        dataSource={data}
        loading={loading}
        columns={columns}
        isMobile={isMobile}
        rowKey="rank"
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
