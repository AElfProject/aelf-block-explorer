'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { pageSizeOption } from '@_utils/contant';
import { ITransactionsResponseItem, TChainID } from '@_api/type';
import { useParams } from 'next/navigation';
import { fetchTransactionList } from '@_api/fetchTransactions';
import { getPageNumber } from '@_utils/formatter';

export default function List({ SSRData, showHeader = true }) {
  console.log(SSRData, 'transactionSSRData');
  const { isMobile } = useMobileAll();

  const { chain } = useParams();
  const fetchData = useCallback(
    async (page, pageSize) => {
      const params = {
        chainId: chain as TChainID,
        skipCount: getPageNumber(page, pageSize),
        maxResultCount: pageSize,
      };
      try {
        const res = await fetchTransactionList(params);
        setTotal(res.total);
        setData(res.transactions);
      } catch (error) {
        setLoading(false);
      }
    },
    [chain],
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<ITransactionsResponseItem[]>(SSRData.transactions);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<ITransactionsResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      type: 'tx',
    });
  }, [timeFormat]);

  const multiTitle = useMemo(() => {
    return `More than > ${total} transactions found`;
  }, [total]);

  const multiTitleDesc = useMemo(() => {
    return `Showing the last 500k records`;
  }, []);

  const pageChange = async (page: number) => {
    setCurrentPage(page);
    fetchData(page, pageSize);
  };

  const pageSizeChange = async (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
    fetchData(page, size);
  };

  return (
    <div>
      {showHeader && <HeadTitle content="Transactions"></HeadTitle>}
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: multiTitleDesc,
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
