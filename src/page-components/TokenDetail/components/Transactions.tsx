import { Pagination } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { VIEWER_TOKEN_TX_LIST } from 'constants/viewerApi';
import TransactionTable from 'components/TransactionTable/TransactionTable';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import { get } from 'utils/axios';
import { useRouter } from 'next/router';

export default function Transactions({ dataSource: dataSourceSSR, actualTotal: actualTotalSSR, headers }) {
  const { symbol } = useRouter().query;
  const [dataLoading, setDataLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState(dataSourceSSR);
  const [actualTotal, setActualTotal] = useState(actualTotalSSR || 0);
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(headers));

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);

  const fetchTransactions = useCallback(async () => {
    const result = await get(VIEWER_TOKEN_TX_LIST, {
      symbol,
      pageSize,
      pageNum: pageIndex,
    });
    if (result.code === 0) {
      setDataSource(
        result.data.list.map((item) => ({
          ...item,
          tx_id: item.txId,
          block_height: item.blockHeight,
          address_from: item.addressFrom,
          address_to: item.addressTo,
          tx_fee: JSON.stringify(item.txFee),
        })),
      );
      setActualTotal(result.data.total);
    } else {
      setDataSource(undefined);
    }
    setDataLoading(false);
  }, [symbol, pageIndex, pageSize]);

  const handlePageChange = useCallback(
    (page, size) => {
      setDataSource(undefined);
      setDataLoading(true);
      setPageIndex(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize],
  );

  useDebounce(
    () => {
      fetchTransactions();
    },
    300,
    [fetchTransactions],
  );

  return (
    <div className="transactions-pane">
      <TransactionTable dataLoading={dataLoading} dataSource={dataSource} />
      <div className="after-table">
        <Pagination
          showLessItems={isMobile}
          showSizeChanger
          current={pageIndex}
          pageSize={pageSize}
          total={actualTotal}
          pageSizeOptions={['25', '50', '100']}
          onChange={handlePageChange}
          onShowSizeChange={(current, size) => handlePageChange(1, size)}
        />
      </div>
    </div>
  );
}
