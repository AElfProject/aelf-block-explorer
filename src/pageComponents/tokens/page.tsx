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
import { useMemo } from 'react';
import { ColumnsType } from 'antd/es/table';
import fetchData from './mock';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import { ITableData, ITokensData } from './type';

export default function TokenList({ SSRData }) {
  const { isMobileSSR: isMobile } = useMobileContext();
  const disposeData = (data) => {
    return {
      total: data.total,
      list: [...data.list],
    };
  };

  const columns = useMemo<ColumnsType<ITableData>>(() => {
    return getColumns();
  }, []);

  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    ITableData,
    ITokensData
  >({
    SSRData: disposeData(SSRData),
    fetchData: fetchData,
    disposeData: disposeData,
  });

  const multiTitle = useMemo(() => {
    return `A total of ${total} tokens found`;
  }, [total]);
  return (
    <div className="tokens-page-container">
      <HeadTitle content="Tokens"></HeadTitle>
      <Table
        titleType="multi"
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="rank"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
        multiTitle={multiTitle}></Table>
    </div>
  );
}
