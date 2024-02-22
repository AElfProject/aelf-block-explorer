'use client';
import Table from '@_components/Table';
import getColumns from './column';
import { useMemo } from 'react';
import { ColumnsType } from 'antd/es/table';
import { HolderItem, ItemSymbolDetailHolders } from '../type';
import { fetchHolderData } from '../mock';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import useResponsive from '@_hooks/useResponsive';
export interface HolderProps {
  holder: ItemSymbolDetailHolders;
}
export default function Holder(props: HolderProps) {
  const { isMobile } = useResponsive();
  const { holder } = props;
  const disposeData = (data: ItemSymbolDetailHolders) => {
    return {
      total: data.total,
      list: [...data.list],
    };
  };
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    HolderItem,
    ItemSymbolDetailHolders
  >({
    SSRData: disposeData(holder),
    fetchData: fetchHolderData,
    disposeData: disposeData,
  });
  const columns = useMemo<ColumnsType<HolderItem>>(() => {
    return getColumns();
  }, []);

  const multiTitle = total > 100 && 'More than > 100 transactions found';
  const multiTitleDesc = total > 100 && `Showing the last 500k records`;

  return (
    <div>
      <Table
        headerLeftNode={`A total of ${total} holders found`}
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
