import { Pagination, Table } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "react-use/lib/useDebounce";
import useLocation from "react-use/lib/useLocation";
import {
  ALL_BLOCKS_API_URL,
  ALL_UNCONFIRMED_BLOCKS_API_URL,
  ALL_BLOCKS_UNCONFIRMED_BLOCKS_API_URL
} from "../../constants";
import useMobile from "../../hooks/useMobile";
import { get } from "../../utils";
import ColumnConfig from "./columnConfig";
import TableLayer from "../../components/TableLayer/TableLayer";

import "./BlockList.styles.less";

export default function BlockList() {
  const { pathname = "" } = useLocation();
  const isMobile = useMobile();
  const [timeFormat, setTimeFormat] = useState("Age");
  const [all, setAll] = useState(0);
  const [dataSource, setDataSource] = useState(undefined);
  const [dataLoading, setDataLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const api = useMemo(() => {
    return pathname.indexOf("unconfirmed") === -1
      ? ALL_BLOCKS_API_URL
      : ALL_UNCONFIRMED_BLOCKS_API_URL;
  }, [pathname]);

  const fetch = useCallback(
    async (page) => {
      setDataLoading(true);
      setDataSource(undefined);
      const data = await get(ALL_BLOCKS_UNCONFIRMED_BLOCKS_API_URL, {
        order: "desc",
        page: page - 1,
        limit: pageSize,
      });

      if(page - 1 === 0) {
        setAll(data?.blocks?.[0]?.block_height ?? 0);
      }
      setDataLoading(false);
      setDataSource(data && data.blocks.length ? data.blocks : null);
    },
    [api, pageSize]
  );

  useEffect(() => {
    if (pageIndex === 1) {
      fetch(pageIndex);
    } else {
      setPageIndex(1);
    }
  }, [pathname]);

  useDebounce(
    () => {
      fetch(pageIndex);
    },
    300,
    [pageIndex, pageSize]
  );

  const handlePageChange = useCallback(
    (page, size) => {
      setPageIndex(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize]
  );

  const columns = useMemo(
    () =>
      ColumnConfig(timeFormat, () => {
        setTimeFormat(timeFormat === "Age" ? "Date Time" : "Age");
      }),
    [timeFormat]
  );

  return (
    <div
      className={`blocks-page-container basic-container-new ${
        isMobile ? "mobile" : ""
      }`}
      key="body"
    >
      <h2>Blocks</h2>
      <div>
        <div className="before-table">
          <div className="left">
            <p>
              Total of {Number(all).toLocaleString()}{" "}Blocks
            </p>
          </div>
          <div className="right">
            <Pagination
              showLessItems={isMobile}
              showSizeChanger={false}
              current={pageIndex}
              pageSize={pageSize}
              total={all}
              onChange={handlePageChange}
            />
          </div>
        </div>
        <TableLayer className="block-table">
          <Table
            loading={dataLoading}
            columns={columns}
            rowKey="block_height"
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
            total={all}
            pageSizeOptions={["25", "50", "100"]}
            onChange={handlePageChange}
            onShowSizeChange={(current, size) => handlePageChange(1, size)}
          />
        </div>
      </div>
    </div>
  );
}
