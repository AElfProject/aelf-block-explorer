import React, { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import { Pagination, Table } from "antd";
import { useDebounce } from "react-use";
import useMobile from "../../hooks/useMobile";
import TableLayer from "../../components/TableLayer/TableLayer";
import { get } from "../../utils";
import getColumn from "./columnConfig";

import "./Contracts.styles.less";
import { VIEWER_CONTRACTS_LIST } from "../../api/url";

export default function Contracts() {
  const isMobile = useMobile();

  const [dataLoading, setDataLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState(undefined);
  const [actualTotal, setActualTotal] = useState(0);

  const total = useMemo(() => {
    if (actualTotal > 1000) return 1000;
    return actualTotal;
  });

  const columns = useMemo(() => {
    return getColumn({
      isMobile,
    });
  }, [isMobile, pageIndex, pageSize]);

  const fetchContractList = useCallback(async () => {
    setDataSource(false);
    setDataLoading(true);
    const result = await get(VIEWER_CONTRACTS_LIST, {
      pageSize,
      pageNum: pageIndex,
    });
    if (result.code === 0) {
      const { data } = result;
      setActualTotal(data.total);
      setDataSource(data.list);
      setDataLoading(false);
    }
  }, [pageSize, pageIndex]);

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
      fetchContractList();
    },
    1000,
    [pageIndex, pageSize]
  );

  return (
    <div
      className={clsx(
        "contracts-page-container basic-container-new",
        isMobile && "mobile"
      )}
    >
      <h2>Contracts</h2>
      <div>
        <div className="before-table">
          <div className="left">
            <p>
              More than {">"} {Number(actualTotal).toLocaleString()} contracts
              found
            </p>
            <p>(Showing the last 1000 contracts only)</p>
          </div>
          <div className="right">
            <Pagination
              showLessItems={isMobile}
              showSizeChanger={false}
              current={pageIndex}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
            />
          </div>
        </div>
        <TableLayer className="block-table">
          <Table
            loading={dataLoading}
            columns={columns}
            rowKey="owner"
            dataSource={dataSource}
            pagination={false}
          />
        </TableLayer>
        <div className="after-table">
          <Pagination
            showLessItems={isMobile}
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
