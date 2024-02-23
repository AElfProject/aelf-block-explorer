import { useEffect, useState } from 'react';
import CardList, { ITableSearch } from './CardList';
import useTableData from '@_hooks/useTable';
import { useMobileContext } from '@app/pageProvider';
import { CollectionInventoryData, InventoryItem } from '../type';
import { fetchInventoryList } from '../mock';
import { useParams } from 'next/navigation';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
export interface InventoryProps {
  search?: string;
  topSearchProps?: ITableSearch;
}
const inventoryList: CollectionInventoryData = {
  total: 0,
  inventory: [],
};

export default function Inventory(props: InventoryProps) {
  const { isMobile } = useMobileAll();
  const { collectionSymbol, chain } = useParams<NftCollectionPageParams>();
  const { topSearchProps, search } = props;

  const disposeData = (data: CollectionInventoryData) => {
    return {
      total: data.total,
      list: [...data.inventory],
    };
  };
  const fetchInventoryListWrap = async ({ page, pageSize }) => {
    console.log('fetchInventoryListWrap');
    return fetchInventoryList({
      chainId: chain, // 主链/侧链
      skipCount: (page - 1) * pageSize,
      maxResultCount: pageSize,
      search: search ?? '',
      collection: collectionSymbol,
    });
  };
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange, searchChange } = useTableData<
    InventoryItem,
    CollectionInventoryData
  >({
    SSRData: disposeData(inventoryList),
    fetchData: fetchInventoryListWrap,
    disposeData: disposeData,
    defaultSearch: search,
  });
  useEffect(() => {
    searchChange(search);
  }, [search]);

  return (
    <div>
      <CardList
        total={total}
        headerTitle={{
          single: {
            title: `A total of ${2000} records found`,
          },
        }}
        showTopSearch={true}
        topSearchProps={topSearchProps}
        loading={loading}
        dataSource={data}
        isMobile={isMobile}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
