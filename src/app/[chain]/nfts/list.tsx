'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import useTableData from '@_hooks/useTable';
import { useMobileContext } from '@app/pageProvider';
import { useCallback, useMemo } from 'react';
import getColumns from './columnConfig';
import fetchData from './mock';
import { INFTsTableData, INFTsTableItem } from './type';

interface TokensListProps {
  SSRData: INFTsTableData;
}

export default function TokensList({ SSRData }: TokensListProps) {
  const { isMobileSSR: isMobile } = useMobileContext();

  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    INFTsTableItem,
    INFTsTableData
  >({
    defaultPageSize: 50,
    SSRData,
    fetchData,
    // disposeData,
  });

  const ChangeOrder = useCallback(() => {
    console.log('change order');
  }, []);

  const columns = useMemo(
    () => getColumns({ currentPage, pageSize, ChangeOrder }),
    [ChangeOrder, currentPage, pageSize],
  );
  const title = useMemo(() => `A total of ${total} ${total <= 1 ? 'collection' : 'collections'} found`, [total]);

  return (
    <div>
      <HeadTitle content="NFTs" />
      <Table
        headerTitle={{
          single: {
            title,
          },
        }}
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
      />
    </div>
  );
}
