'use client';
import Table from '@_components/Table';
import useTableData from '@_hooks/useTable';
import { useMobileContext } from '@app/pageProvider';
import { useMemo } from 'react';
import { fetchHoldersData } from '../../mock';
import { IHolderItem, IHolderTableData, ITokenSearchProps } from '../../type';
import getColumns from './columns';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';

interface HoldersProps extends ITokenSearchProps {
  SSRData: IHolderTableData;
}

export default function Holders({ SSRData, searchType, search, onSearchChange, onSearchInputChange }: HoldersProps) {
  const { isMobile } = useMobileAll();

  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    IHolderItem,
    IHolderTableData
  >({
    SSRData,
    defaultPageSize: 50,
    fetchData: fetchHoldersData,
  });

  const columns = useMemo(() => getColumns({ currentPage, pageSize }), [currentPage, pageSize]);
  const title = useMemo(() => `A total of ${total} ${total <= 1 ? 'token' : 'tokens'} found`, [total]);

  return (
    <div>
      <Table
        headerTitle={{
          single: {
            title,
          },
        }}
        topSearchProps={{
          value: search || '',
          onChange: ({ currentTarget }) => {
            onSearchInputChange(currentTarget.value);
          },
          onSearchChange,
        }}
        showTopSearch
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="index"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
