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
import { useMemo } from 'react';
import { ColumnsType } from 'antd/es/table';
import fetchData from './mock';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
export interface ITableDataType {
  address: string;
  contractName: string;
  type: string;
  version: string;
  balance: string;
  txns: number;
  lastUpdateTime: string;
}

export interface IResponseData {
  total: number;
  data: ITableDataType[];
}

export default function List({ SSRData }) {
  const { isMobileSSR: isMobile } = useMobileContext();

  const columns = useMemo<ColumnsType<ITableDataType>>(() => {
    return getColumns();
  }, []);

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
    return `A total of ${total} contracts found`;
  }, [total]);

  return (
    <div>
      <HeadTitle content="Contracts"></HeadTitle>
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: '(Showing the last 1,000 contracts only)',
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="address"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
