/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:57:13
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 14:00:24
 * @Description: BlockList
 */
'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { isMobileDevices } from '@_utils/isMobile';

export interface TableDataType {
  key: string | number;
  block_height: number;
  time: string;
  Txn: number;
  Producer: {
    name: string;
    chain_id: string;
  };
  Reward: string;
  'Burnt Fees': string;
}

const data: TableDataType[] = [
  {
    key: '1',
    block_height: 165018684,
    time: '2023-08-14T08:20:16.3833194Z',
    Txn: 32,
    Producer: {
      name: '29JHMRj99HfhiNUfXFu6jbfujTnZS4KC8NGx3zJeHCKbjbQDP4',
      chain_id: 'AELF',
    },
    Reward: '0.00112726 ELF',
    'Burnt Fees': '1,550.00011273 ELF',
  },
  {
    key: '2',
    block_height: 165018684,
    time: '2023-08-14T08:20:16.3833194Z',
    Txn: 32,
    Producer: {
      name: '29JHMRj99HfhiNUfXFu6jbfujTnZS4KC8NGx3zJeHCKbjbQDP4',
      chain_id: 'AELF',
    },
    Reward: '0.00112726 ELF',
    'Burnt Fees': '1,550.00011273 ELF',
  },
  {
    key: '3',
    block_height: 165018684,
    time: '2023-08-14T08:20:16.3833194Z',
    Txn: 32,
    Producer: {
      name: '29JHMRj99HfhiNUfXFu6jbfujTnZS4KC8NGx3zJeHCKbjbQDP4',
      chain_id: 'AELF',
    },
    Reward: '0.00112726 ELF',
    'Burnt Fees': '1,550.00011273 ELF',
  },
];

export default function BlockList({ isMobileSSR }) {
  const [isMobile, setIsMobile] = useState(isMobileSSR);
  useEffect(() => {
    setIsMobile(isMobileDevices());
  }, []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(101);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const handleTimeChange = () => {
    if (timeFormat === 'Age') {
      setTimeFormat('Date Time (UTC)');
    } else {
      setTimeFormat('Age');
    }
  };
  const columns = useMemo<ColumnsType<TableDataType>>(() => {
    return getColumns({ timeFormat, handleTimeChange });
  }, [timeFormat]);

  const pageChange = (page: number, pageSize?: number) => {
    console.log(page, pageSize, 'blocks');
    setCurrentPage(page);
  };

  const pageSizeChange = (size) => {
    console.log(size, 'size blocks');
    setPageSize(size);
  };
  return (
    <div>
      <HeadTitle content="Blocks"></HeadTitle>
      <Table
        titleType="multi"
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="key"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
        multiTitle="A total of 344,256,109 transactions found"
        multiTitleDesc="(Showing blocks between #17785761 to #17785785)"></Table>
    </div>
  );
}
