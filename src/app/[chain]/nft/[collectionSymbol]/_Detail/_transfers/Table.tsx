'use client';
import Table, { ITableSearch } from '@_components/Table';
import getColumns from './column';
import { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { CollectionTransfersData, CollectionTransfer } from '../type';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import { fetchTransferList } from '../mock';
import { useParams } from 'next/navigation';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
export interface ItemActivityTableProps {
  transferList: CollectionTransfersData;
  search?: string;
  topSearchProps?: ITableSearch;
}
export default function ItemActivityTable(props: ItemActivityTableProps) {
  const { collectionSymbol, chain } = useParams<NftCollectionPageParams>();
  const { transferList, topSearchProps, search } = props;
  const { isMobile } = useMobileAll();
  const disposeData = (data: CollectionTransfersData) => {
    return {
      total: data.total,
      list: [...data.transfers],
    };
  };
  const fetchTableData = async ({ page, pageSize }) => {
    return fetchTransferList({
      maxResultCount: pageSize,
      skipCount: (page - 1) * pageSize,
      search: search ?? '',
      symbol: collectionSymbol,
      chainId: chain,
    });
  };

  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange, searchChange } = useTableData<
    CollectionTransfer,
    CollectionTransfersData
  >({
    SSRData: disposeData(transferList),
    fetchData: fetchTableData,
    disposeData: disposeData,
    defaultSearch: search,
  });
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<CollectionTransfer>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  useEffect(() => {
    searchChange(search);
  }, [search, searchChange]);

  return (
    <div className="collection-transfers-table">
      <Table
        headerTitle={{
          single: {
            title: `A total of ${total} records found`,
          },
        }}
        showTopSearch={true}
        topSearchProps={topSearchProps}
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
