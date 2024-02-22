'use client';
import Table from '@_components/Table';
import getColumns from './column';
import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { IActivityTableData, ItemSymbolDetailActivity } from '../type';
import { fetchActiveData } from '../mock';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import useResponsive from '@_hooks/useResponsive';
export interface ItemActivityTableProps {
  activeData: ItemSymbolDetailActivity;
}
export default function ItemActivityTable(props: ItemActivityTableProps) {
  const { isMobile } = useResponsive();
  const { activeData } = props;
  const disposeData = (data: ItemSymbolDetailActivity) => {
    return {
      total: data.total,
      list: [...data.list],
    };
  };
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    IActivityTableData,
    ItemSymbolDetailActivity
  >({
    SSRData: disposeData(activeData),
    fetchData: fetchActiveData,
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
        headerLeftNode={`A total of ${total} records found`}
        headerTitle={{
          multi: {
            title: multiTitle || '',
            desc: multiTitleDesc || '',
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
