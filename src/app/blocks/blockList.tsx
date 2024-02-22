/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:57:13
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 17:02:47
 * @Description: BlockList
 */
'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import fetchData from './mock';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import useResponsive from '@_hooks/useResponsive';

export interface ITableData {
  blockHeight: number;
  timestamp: string;
  txns: number;
  Producer: {
    name: string;
    chain_id: string;
  };
  blockHash?: string;
  reward: string;
  burntFee: string;
}

export interface IBlocksData {
  total: number;
  blocks: ITableData[];
}

export default function BlockList({ SSRData }) {
  const { isMobile } = useResponsive();
  const disposeData = (data) => {
    return {
      total: data.total,
      list: [...data.blocks],
    };
  };

  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<ITableData>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    ITableData,
    IBlocksData
  >({
    SSRData: disposeData(SSRData),
    fetchData: fetchData,
    disposeData: disposeData,
  });

  const multiTitle = useMemo(() => {
    return `A total of ${total} transactions found`;
  }, [total]);
  return (
    <div>
      <HeadTitle content="Blocks"></HeadTitle>
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: '(Showing blocks between #17785761 to #17785785)',
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="blockHeight"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
