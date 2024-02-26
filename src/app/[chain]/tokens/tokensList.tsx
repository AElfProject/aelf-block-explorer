'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import useTableData from '@_hooks/useTable';
import { useMobileContext } from '@app/pageProvider';
import { useCallback, useMemo } from 'react';
import getColumns from './columnConfig';
import fetchData from './mock';
import { ITokensTableData, ITokensTableItem } from './type';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';

interface TokensListProps {
  SSRData: ITokensTableData;
}

export default function TokensList({ SSRData }: TokensListProps) {
  const { isMobile } = useMobileAll();

  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    ITokensTableItem,
    ITokensTableData
  >({
    SSRData,
    fetchData,
    // disposeData,
  });

  const ChangeOrder = useCallback(() => {}, []);

  const columns = useMemo(
    () => getColumns({ currentPage, pageSize, ChangeOrder }),
    [ChangeOrder, currentPage, pageSize],
  );
  const title = useMemo(() => `A total of ${total} tokens found`, [total]);

  return (
    <div>
      <HeadTitle content="Tokens" />
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
