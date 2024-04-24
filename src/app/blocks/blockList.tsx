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
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
import { IBlocksResponseItem } from '@_api/type';
import { pageSizeOption } from '@_utils/contant';

export interface IBlocksData {
  total: number;
  blocks: IBlocksResponseItem[];
}

const disposeData = (data) => {
  return {
    total: data.total,
    list: [...data.blocks],
  };
};

export default function BlockList({ SSRData }) {
  const { isMobile } = useMobileAll();

  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<IBlocksResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    IBlocksResponseItem,
    IBlocksData
  >({
    SSRData: disposeData(SSRData),
    fetchData: fetchData,
    disposeData: disposeData,
  });

  console.log(1111);

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
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
