/*
 * @author: Peterbjx
 * @Date: 2023-08-15 14:57:42
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 19:49:10
 * @Description: contract list
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
  address: string;
  contractName: string;
  isSystemContract: boolean;
  version: string;
  balance: string;
  txn: number;
  updateTime: string;
}

const data: TableDataType[] = [
  {
    key: '1',
    address: 'KNdM6U6PyPsgyena8rPHTbCoMrkrALhxAy1b8Qx2cgi4169xr',
    contractName: 'AElf.ContractNames.Treasury',
    isSystemContract: true,
    version: '1.5.0.0',
    balance: '1,000,000,000.00112726 ELF',
    txn: 2449,
    updateTime: '2023/07/26 11:54:52+00:00',
  },
  {
    key: '2',
    address: 'KNdM6U6PyPsgyena8rPHTbCoMrkrALhxAy1b8Qx2cgi4169xr',
    contractName: 'EBridge.Contracts.Report',
    isSystemContract: true,
    version: '1.5.0.0',
    balance: '1,000,000,000.00112726 ELF',
    txn: 2449,
    updateTime: '2023/07/26 11:54:52+00:00',
  },
  {
    key: '3',
    address: 'KNdM6U6PyPsgyena8rPHTbCoMrkrALhxAy1b8Qx2cgi4169xr',
    contractName: 'AElf.ContractNames.Treasury',
    isSystemContract: true,
    version: '1.5.0.0',
    balance: '1,000,000,000.00112726 ELF',
    txn: 2449,
    updateTime: '2023/07/26 11:54:52+00:00',
  },
];

export default function List({ isMobileSSR }) {
  const [isMobile, setIsMobile] = useState(isMobileSSR);
  useEffect(() => {
    setIsMobile(isMobileDevices());
  }, []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [total, setTotal] = useState<number>(101);
  const columns = useMemo<ColumnsType<TableDataType>>(() => {
    return getColumns();
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
      <HeadTitle content="Contracts"></HeadTitle>
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
        multiTitle="A total of 31 contracts found"
        multiTitleDesc="(Showing the last 1,000 contracts only)"></Table>
    </div>
  );
}
