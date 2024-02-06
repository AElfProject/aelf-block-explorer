'use client';
import AddressWithCopy from '@_components/AddressWithCopy';
import Table from '@_components/Table';
import useTableData from '@_hooks/useTable';
import { thousandsNumber } from '@_utils/formatter';
import { useMobileContext } from '@app/pageProvider';
import { Descriptions, DescriptionsProps } from 'antd';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { fetchTransfersData } from '../../mock';
import { ITransferItem, ITransferTableData, SearchType } from '../../type';
import getColumns from './columns';

interface TransfersProps {
  SSRData: ITransferTableData;
  searchType: SearchType;
  search?: string;
}

const labelStyle: React.CSSProperties = {
  color: '#858585',
  fontSize: '10px',
  lineHeight: '18px',
};

const contentStyle: React.CSSProperties = {
  color: '#252525',
  fontSize: '14px',
  lineHeight: '22px',
};

export default function Transfers({ SSRData, search, searchType }: TransfersProps) {
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

  const searchByHolder: DescriptionsProps['items'] = useMemo(
    () => [
      {
        key: 'desc',
        label: 'Filtered By Token Txn Hash',
        children: <AddressWithCopy address={search || ''} />,
        labelStyle: {
          color: '#252525',
          fontWeight: 500,
        },
        span: 2,
      },
      {
        key: 'balance',
        label: 'BALANCE',
        children: thousandsNumber(SSRData.balance),
      },
      {
        key: 'value',
        label: 'VALUE',
        children: thousandsNumber(SSRData.value),
      },
    ],
    [SSRData.balance, SSRData.value, search],
  );
  const searchByHash: DescriptionsProps['items'] = useMemo(
    () => [
      {
        key: 'desc',
        label: 'Filtered By Token Holder',
        labelStyle: {
          color: '#252525',
          fontWeight: 500,
        },
        children: (
          <Link className="block w-[120px] truncate text-xs leading-5 text-link" href={`tx/${search}`}>
            {search}
          </Link>
        ),
        span: 2,
      },
    ],
    [search],
  );
  return (
    <div>
      <div className="mx-4 border-b border-b-[#e6e6e6] pb-4">
        {searchType === SearchType.address && (
          <Descriptions
            contentStyle={contentStyle}
            labelStyle={labelStyle}
            colon={false}
            layout="vertical"
            column={4}
            items={searchByHolder}
          />
        )}
        {searchType === SearchType.txHash && (
          <Descriptions
            contentStyle={contentStyle}
            labelStyle={labelStyle}
            colon={false}
            layout="vertical"
            column={4}
            items={searchByHash}
          />
        )}
      </div>
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
