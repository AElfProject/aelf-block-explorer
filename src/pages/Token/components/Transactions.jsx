import { Pagination } from "antd";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router";
import { useDebounce } from "react-use";
import { VIEWER_TOKEN_TX_LIST } from "../../../api/url";
import TransactionTable from "../../../components/TransactionTable/TransactionTable";
import useMobile from "../../../hooks/useMobile";
import { get } from "../../../utils";

export default function Transactions() {
  const isMobile = useMobile();
  const { symbol } = useParams();
  const [dataLoading, setDataLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState(undefined);
  const [actualTotal, setActualTotal] = useState(0);

  const fetchTransactions = useCallback(async () => {
    setDataLoading(true);
    setDataSource(undefined);
    const result = await get(VIEWER_TOKEN_TX_LIST, {
      symbol,
      pageSize,
      pageNum: pageIndex,
    });
    setDataLoading(false);
    if (result.code === 0) {
      setDataSource(
        result.data.list.map((item) => ({
          ...item,
          tx_id: item.txId,
          block_height: item.blockHeight,
          address_from: item.addressFrom,
          address_to: item.addressTo,
          tx_fee: JSON.stringify(item.txFee),
        }))
      );
      setActualTotal(result.data.total);
    }
  }, [symbol, pageIndex, pageSize]);

  const handlePageChange = useCallback(
    (page, size) => {
      setDataSource(false);
      setDataLoading(true);
      setPageIndex(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize]
  );

  useDebounce(
    () => {
      fetchTransactions();
    },
    300,
    [fetchTransactions]
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
          pageSizeOptions={["25", "50", "100"]}
          onChange={handlePageChange}
          onShowSizeChange={(current, size) => handlePageChange(1, size)}
        />
      </div>
    </div>
  );
}
