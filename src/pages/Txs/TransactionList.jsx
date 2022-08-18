import { Pagination, Table } from "antd";
import React from "react";
import { useState } from "react";
import "./TransactionList.style.less";
import { useMemo } from "react";
import useLocation from "react-use/lib/useLocation";
import {
  ALL_TXS_API_URL,
  ALL_UNCONFIRMED_TXS_API_URL,
  ELF_REALTIME_PRICE_URL,
  TXS_BLOCK_API_URL,
} from "../../constants";
import { get, getContractNames } from "../../utils";
import ColumnConfig from "./columnConfig";
import { useCallback } from "react";
import { useDebounce, useEffectOnce } from "react-use";
import useMobile from "../../hooks/useMobile";

export default function TransactionList() {
  const { pathname = "", search } = useLocation();
  const isMobile = useMobile();

  const [price, setPrice] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [timeFormat, setTimeFormat] = useState("Age");
  const [dataSource, setDataSource] = useState(undefined);
  const [actualTotal, setActualTotal] = useState(0);

  const total = useMemo(() => {
    if (actualTotal > 500000) return 500000;
    return actualTotal;
  });

  const pageTitle = useMemo(
    () =>
      pathname.includes("unconfirmed")
        ? "Unconfirmed Transactions"
        : "Transactions",
    [pathname]
  );

  const columns = useMemo(
    () =>
      ColumnConfig(timeFormat, price, () => {
        setTimeFormat(timeFormat === "Age" ? "Date Time" : "Age");
      }),
    [timeFormat, price]
  );

  useEffectOnce(() => {
    get(ELF_REALTIME_PRICE_URL).then((price) => setPrice(price));
  });

  const merge = (data = {}, contractNames) => {
    const { transactions = [] } = data;
    return (transactions || []).map((item) => ({
      ...item,
      contractName: contractNames[item.address_to],
    }));
  };

  const fetch = useCallback(
    async (page = 1) => {
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
      });
      const contractNames = await getContractNames();

      setActualTotal(data ? data.total : 0);
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
              transactions found
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
        <div className="transaction-table">
          <div className="block" />
          <Table
            loading={dataLoading}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowKey="tx_id"
          />
          <div className="block" />
        </div>
        <div className="after-table">
          <Pagination
            showSizeChanger
            current={pageIndex}
            pageSize={pageSize}
            total={total}
            pageSizeOptions={["25", "50", "100"]}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
