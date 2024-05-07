'use client';
import Table, { ITableSearch } from '@_components/Table';
import getColumns from './column';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { CollectionTransfersData, CollectionTransfer } from '../type';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import { useParams } from 'next/navigation';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
import { NftCollectionPageParams, CollectionSymbol } from 'global';
import { getPageNumber } from '@_utils/formatter';
import { fetchNFTTransfers } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
export interface ItemActivityTableProps {
  search?: string;
  topSearchProps?: ITableSearch;
}
export default function ItemActivityTable(props: ItemActivityTableProps) {
  const { collectionSymbol, chain } = useParams<NftCollectionPageParams>();
  const { topSearchProps, search } = props;
  const { isMobile } = useMobileAll();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<CollectionTransfer[]>([]);

  const fetchTableData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNFTTransfers({
        maxResultCount: pageSize,
        skipCount: getPageNumber(currentPage, pageSize),
        search: search ?? '',
        collectionSymbol: collectionSymbol,
        chainId: chain as TChainID,
      });
      setData(data.list);
      setTotal(data.total);
      console.log(data, 'data');
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [pageSize, currentPage, search, collectionSymbol, chain]);

  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<CollectionTransfer>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const pageChange = async (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = async (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

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
