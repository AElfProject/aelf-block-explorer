import { Pagination } from "antd";
import React from "react";
import { useState } from "react";
import "./TransactionList.style.less";
import { useMemo } from "react";
import useLocation from "react-use/lib/useLocation";
import {
  ALL_TXS_API_URL,
  ALL_UNCONFIRMED_TXS_API_URL,
  TXS_BLOCK_API_URL,
} from "../../constants";
import { get, getContractNames } from "../../utils";
import { useCallback } from "react";
import { useDebounce } from "react-use";
import useMobile from "../../hooks/useMobile";
import TransactionTable from "../../components/TransactionTable/TransactionTable";

export default function TransactionList() {
  const { pathname = "", search } = useLocation();
  const isMobile = useMobile();

  const [dataLoading, setDataLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState(undefined);
  const [actualTotal, setActualTotal] = useState(0);

  const total = useMemo(() => {
    if (actualTotal > 500000) return 500000;
    return actualTotal;
  });

  const isUnconfirmed = useMemo(
    () => pathname.includes("unconfirmed"),
    [pathname]
  );

  const pageTitle = useMemo(() => {
    return isUnconfirmed ? "Unconfirmed Transactions" : "Transactions";
  }, [isUnconfirmed]);

  const merge = (data = {}, contractNames) => {
    const { transactions = [] } = data;
    return (transactions || []).map((item) => ({
      ...item,
      contractName: contractNames[item.address_to],
    }));
  };

  const fetch = useCallback(
    async (page = 1) => {
      setDataSource(undefined);
      setDataLoading(true);
      let url;
      if (search) {
        url = TXS_BLOCK_API_URL;
      } else {
        url =
          pathname.indexOf("unconfirmed") === -1
            ? ALL_TXS_API_URL
            : ALL_UNCONFIRMED_TXS_API_URL;
      }
      const data = await get(url, {
        order: "desc",
        page: page - 1,
        limit: pageSize,
        block_hash: (search && search.slice(1)) || undefined,
      });
      const contractNames = await getContractNames();

      setActualTotal(data ? data.total || data.transactions.length : 0);
      const transactions = merge(data, contractNames);
      setDataLoading(false);
      setDataSource(transactions);
    },
    [pathname, get, getContractNames, merge, pageSize]
  );

  const handlePageChange = useCallback(
    (page, size) => {
      setPageIndex(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize]
  );

  useDebounce(
    () => {
      fetch(pageIndex);
    },
    300,
    [pageIndex, pageSize]
  );

  return (
    <div
      className={`txs-page-container basic-container-new ${
        isMobile ? "mobile" : ""
      }`}
      key="body"
    >
      <h2>{pageTitle}</h2>
      <div>
        <div className="before-table">
          <div className="left">
            <p>
              More than {">"} {Number(actualTotal).toLocaleString()}{" "}
              {isUnconfirmed && "unconfirmed"} transactions found
            </p>
            <p>(showing the last 500k records)</p>
          </div>
          <div className="right">
            <Pagination
              showSizeChanger={false}
              current={pageIndex}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
            />
          </div>
        </div>
        <TransactionTable dataLoading={dataLoading} dataSource={dataSource} />
        <div className="after-table">
          <Pagination
            showSizeChanger
            current={pageIndex}
            pageSize={pageSize}
            total={total}
            pageSizeOptions={["25", "50", "100"]}
            onChange={handlePageChange}
            onShowSizeChange={(current, size) => handlePageChange(1, size)}
          />
        </div>
      </div>
    </div>
  );
}
