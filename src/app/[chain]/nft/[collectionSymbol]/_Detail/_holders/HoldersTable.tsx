'use client';
import Table, { ITableSearch } from '@_components/Table';
import { useEffect, useMemo } from 'react';
import { ColumnsType } from 'antd/es/table';
import { CollectionHoldersData, HolderItem } from '../type';
import getColumns from './column';
import { fetchHolderData } from '../mock';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import { useParams } from 'next/navigation';

export interface HolderProps {
  topSearchProps?: ITableSearch;
  search?: string;
}
const holder: CollectionHoldersData = {
  total: 0,
  holders: [],
};
export default function Holder(props: HolderProps) {
  const { topSearchProps, search } = props;
  const { isMobileSSR: isMobile } = useMobileContext();
  const { collectionSymbol, chain } = useParams<NftCollectionPageParams>();
  const disposeData = (data: CollectionHoldersData) => {
    return {
      total: data.total,
      list: [...data.holders],
    };
  };
  const fetchHolderDataWrap = async ({ page, pageSize }) => {
    return fetchHolderData({
      chainId: chain, // 主链/侧链
      skipCount: (page - 1) * pageSize,
      maxResultCount: pageSize,
      symbol: collectionSymbol,
    });
  };
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange, searchChange } = useTableData<
    HolderItem,
    CollectionHoldersData
  >({
    SSRData: disposeData(holder),
    fetchData: fetchHolderDataWrap,
    disposeData: disposeData,
    defaultSearch: search,
  });
  const columns = useMemo<ColumnsType<HolderItem>>(() => {
    return getColumns();
  }, []);
  useEffect(() => {
    searchChange(search);
  }, [search]);

  return (
    <div>
      <Table
        headerTitle={{
          single: {
            title: `A total of ${total} holders found`,
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
