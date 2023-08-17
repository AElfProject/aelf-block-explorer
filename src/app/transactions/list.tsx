'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { isMobileDevices } from '@_utils/isMobile';

export interface TableDataType {
  key: string | number;
  tx_id: string;
  method: string;
  time: string;
  block_height: number;
  address_from: string;
  address_to: string;
  value: string;
  tx_fee: string;
}

const data: TableDataType[] = [
  {
    key: '1',
    tx_id: 'cc764efe0d5b8f9a73fffa3aecc7e3a26d715a715a764af464dd80dd7f2ca03e',
    block_height: 165018684,
    method: 'DonateResourceToken',
    time: '2023-08-15T08:42:41.1123602Z',
    address_from: 'AELF_YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy_AELF',
    address_to: 'AELF.Contract.Token',
    value: '0 ELF',
    tx_fee: '0 ELF',
  },
  {
    key: '2',
    tx_id: 'cc764efe0d5b8f9a73fffa3aecc7e3a26d715a715a764af464dd80dd7f2ca03e',
    block_height: 165018684,
    method: 'DonateResourceToken',
    time: '2023-08-15T08:42:41.1123602Z',
    address_from: 'AELF_YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy_AELF',
    address_to: 'AELF.Contract.Token',
    value: '0 ELF',
    tx_fee: '0 ELF',
  },
  {
    key: '3',
    tx_id: 'cc764efe0d5b8f9a73fffa3aecc7e3a26d715a715a764af464dd80dd7f2ca03e',
    block_height: 165018684,
    method: 'DonateResourceToken',
    time: '2023-08-15T08:42:41.1123602Z',
    address_from: 'AELF_YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy_AELF',
    address_to: 'AELF.Contract.Token',
    value: '0 ELF',
    tx_fee: '0 ELF',
  },
];

export default function List({ isMobileSSR }) {
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

  const multiTitle = useMemo(() => {
    return `More than > ${total} transactions found`;
  }, [total]);

  const multiTitleDesc = useMemo(() => {
    return `Showing the last 500k records`;
  }, []);

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
      <HeadTitle content="Transactions"></HeadTitle>
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
        multiTitle={multiTitle}
        multiTitleDesc={multiTitleDesc}></Table>
    </div>
  );
}
