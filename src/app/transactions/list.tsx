'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import fetchData from './mock';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
import { pageSizeOption } from '@_utils/contant';
import { ITransactionsResponseItem } from '@_api/type';
interface ITransactionsData {
  total: number;
  data: ITransactionsResponseItem[];
}

export default function List({ SSRData, showHeader = true }) {
  const { isMobile } = useMobileAll();
  const disposeData = (data) => {
    return {
      total: data.total,
      list: [...data.data],
    };
  };
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    ITransactionsResponseItem,
    ITransactionsData
  >({
    SSRData: disposeData(SSRData),
    fetchData: fetchData,
    disposeData: disposeData,
  });
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<ITransactionsResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      type: 'tx',
    });
  }, [timeFormat]);

  const multiTitle = useMemo(() => {
    return `More than > ${total} transactions found`;
  }, [total]);

  const multiTitleDesc = useMemo(() => {
    return `Showing the last 500k records`;
  }, []);

  return (
    <div>
      {showHeader && <HeadTitle content="Transactions"></HeadTitle>}
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: multiTitleDesc,
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
