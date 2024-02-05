'use client';
import Table from '@_components/Table';
import useTableData from '@_hooks/useTable';
import { useMobileContext } from '@app/pageProvider';
import { useMemo, useState } from 'react';
import { fetchTransfersData } from '../../mock';
import { ITransferItem, ITransferTableData } from '../../type';
import getColumns from './columns';

interface TransfersListProps {
  SSRData: ITransferTableData;
}

export default function Transfers({ SSRData }: TransfersListProps) {
  const { isMobileSSR: isMobile } = useMobileContext();
  const [timeFormat, setTimeFormat] = useState<string>('Date Time (UTC)');

  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    ITransferItem,
    ITransferTableData
  >({
    SSRData,
    fetchData: fetchTransfersData,
    // disposeData,
  });

  const columns = useMemo(
    () =>
      getColumns({
        timeFormat,
        handleTimeChange: () => setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age'),
      }),
    [timeFormat],
  );
  const title = useMemo(() => `A total of ${total} tokens found`, [total]);

  return (
    <div>
      <Table
        titleType="multi"
        multiTitle={title}
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
