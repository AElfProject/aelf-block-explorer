import React, { useCallback, useMemo, useState } from "react";
import { Pagination, Table } from "antd";
import { useDebounce } from "react-use";
import clsx from "clsx";
import TableLayer from "../../components/TableLayer/TableLayer";
import useMobile from "../../hooks/useMobile";
import getColumnConfig from "./columnConfig";
import { get } from "../../utils";
import { VIEWER_GET_ALL_TOKENS } from "../../api/url";

import "./Tokens.styles.less";
import { symbolListToSymbolAliasName } from '../../utils/formater';

export default function Tokens() {
  const isMobile = useMobile();
  const [dataLoading, setDataLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState(undefined);
  const [actualTotal, setActualTotal] = useState(0);

  const preTotal = useMemo(
    () => pageSize * (pageIndex - 1),
    [pageSize, pageIndex]
  );

  const columns = useMemo(
    () => getColumnConfig(isMobile, preTotal),
    [isMobile, preTotal]
  );

  const fetchData = useCallback(async () => {
    setDataSource(false);
    setDataLoading(true);
    const result = await get(VIEWER_GET_ALL_TOKENS, {
      pageSize,
      pageNum: pageIndex,
    });
    if (result.code === 0) {
      const { data } = result;
      setActualTotal(data.total);
      // SGR-1 -> SGR
      symbolListToSymbolAliasName(data.list);
      setDataSource(data.list);
      setDataLoading(false);
    }
  }, [pageIndex, pageSize]);

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
      fetchData();
    },
    300,
    [pageIndex, pageSize]
  );

  return (
    <div
      className={clsx(
        "tokens-page-container basic-container-new",
        isMobile && "mobile"
      )}
    >
      <h2>Tokens</h2>
      <div className="before-table">
        <div className="left">
          <p>
            A total of {Number(actualTotal).toLocaleString()} Token Contracts
            found
          </p>
        </div>
        <div className="right">
          <Pagination
            showLessItems={isMobile}
            showSizeChanger={false}
            current={pageIndex}
            pageSize={pageSize}
            total={actualTotal}
            onChange={handlePageChange}
          />
        </div>
      </div>
      <TableLayer>
        <Table
          loading={dataLoading}
          columns={columns}
          rowKey="id"
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
          total={actualTotal}
          pageSizeOptions={["25", "50", "100"]}
          onChange={handlePageChange}
          onShowSizeChange={(current, size) => handlePageChange(1, size)}
        />
      </div>
    </div>
  );
}
