import { Pagination, Table } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { VIEWER_TRANSFER_LIST } from "../../../../api/url";
import TableLayer from "../../../../components/TableLayer/TableLayer";
import useMobile from "../../../../hooks/useMobile";
import { get } from "../../../../utils";
import getColumnConfig from "./columnConfig";

import "./Transfers.styles.less";

export default function Transfers({ address }) {
  const isMobile = useMobile();
  const [timeFormat, setTimeFormat] = useState("Age");
  const [dataLoading, setDataLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState(undefined);

  const columns = useMemo(() => {
    return getColumnConfig({
      address,
      isMobile,
      timeFormat,
      handleFormatChange: () => {
        setTimeFormat(timeFormat === "Age" ? "Date Time" : "Age");
      },
    });
  }, [address, isMobile, timeFormat]);

  const handlePageChange = useCallback(
    (page, size) => {
      setDataSource(false);
      setDataLoading(true);
      setPageIndex(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize]
  );

  const fetchTransfers = useCallback(async () => {
    const result = await get(VIEWER_TRANSFER_LIST, {
      pageSize,
      pageNum: pageIndex,
      address,
    });
    if (result.code === 0) {
      const { data } = result;
      setTotal(data.total);
      setDataSource(data.list);
    }
    setDataLoading(false);
  }, [address, pageSize, pageIndex]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  return (
    <div className="transfers-pane">
      <TableLayer>
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={dataLoading}
          pagination={false}
          rowKey="id"
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
  );
}
