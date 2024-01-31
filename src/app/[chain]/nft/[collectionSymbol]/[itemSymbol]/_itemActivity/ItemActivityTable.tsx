'use client';
import Table from '@_components/Table';
import getColumns from './column';
import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { IActivityTableData } from './type';
import { fetchData } from './mock';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
interface IActivityTableDataWithAmount {
  total: number;
  data: IActivityTableData[];
}

export default function ItemActivityTable({ SSRData }) {
  const { isMobileSSR: isMobile } = useMobileContext();
  const disposeData = (data) => {
    return {
      total: data.total,
      list: [...data.data],
    };
  };
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    IActivityTableData,
    IActivityTableDataWithAmount
  >({
    SSRData: disposeData(SSRData),
    fetchData: fetchData,
    disposeData: disposeData,
  });
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<IActivityTableData>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const multiTitle = total > 100 && 'More than > 100 transactions found';
  const multiTitleDesc = total > 100 && `Showing the last 500k records`;

  return (
    <div>
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
