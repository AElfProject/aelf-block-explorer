import { Pagination } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import TransactionTable from 'components/TransactionTable/TransactionTable';
import { ADDRESS_TXS_API_URL } from 'constants/api';
import useMobile from 'hooks/useMobile';
import { get } from 'utils/axios';

require('./Transactions.styles.less');

export default function Transactions({ address }) {
  const isMobile = useMobile();
  const [dataLoading, setDataLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState(undefined);

  const handlePageChange = useCallback(
    (page, size) => {
      setDataSource(undefined);
      setDataLoading(true);
      setPageIndex(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize],
  );

  const fetchTransactions = useCallback(async () => {
    const result = await get(ADDRESS_TXS_API_URL, {
      limit: pageSize,
      page: pageIndex - 1,
      address,
      order: 'DESC',
    });
    const { transactions = [], total: resTotal = 0 } = result;
    setTotal(resTotal);
    setDataSource(transactions);
    setDataLoading(false);
  }, [address, pageSize, pageIndex]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="transactions-pane">
      <TransactionTable dataLoading={dataLoading} dataSource={dataSource} />
      <div className="after-table">
        <Pagination
          showLessItems={isMobile}
          showSizeChanger
          current={pageIndex}
          pageSize={pageSize}
          total={total}
          pageSizeOptions={['10', '25', '50', '100']}
          onChange={handlePageChange}
          onShowSizeChange={(current, size) => handlePageChange(1, size)}
        />
      </div>
    </div>
  );
}
