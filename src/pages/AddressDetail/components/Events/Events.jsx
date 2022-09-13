import { Pagination, Table } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDebounce } from "react-use";
import { VIEWER_EVENT_LIST } from "../../../../api/url";
import EventItem from "../../../../components/EventItem";
import TableLayer from "../../../../components/TableLayer/TableLayer";
import useMobile from "../../../../hooks/useMobile";
import { get } from "../../../../utils";

import "./Events.styles.less";
export default function Events() {
  const { address } = useParams();
  const isMobile = useMobile();
  const [total, setTotal] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataSource, setDataSource] = useState(undefined);

  const columns = useMemo(
    () => [
      {
        title: "Txn Hash",
        width: 176,
        ellipsis: true,
        dataIndex: "txId",
        render(txId) {
          return <Link to={`/tx/${txId}`}>{txId}</Link>;
        },
      },
      { title: "Method", width: 180, ellipsis: true, dataIndex: "name" },
      {
        title: "Logs",
        dataIndex: "data",
        render(data, record) {
          console.log(">>>data", data);
          return <EventItem {...data} Name={record.name} Address={address} />;
        },
      },
    ],
    []
  );
  const fetchEvents = useCallback(async () => {
    const result = await get(VIEWER_EVENT_LIST, {
      pageSize,
      pageNum: pageIndex,
      address,
    });
    setDataLoading(false);
    if (result.code === 0) {
      console.log(">>>res", result.data.list);
      setDataSource(result.data.list);
    }
  }, [address, pageIndex, pageSize]);

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
      fetchEvents();
    },
    1000,
    [pageIndex, pageSize]
  );

  return (
    <div className="events-pane">
      <TableLayer>
        <Table
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          loading={dataLoading}
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
          pageSizeOptions={["10", "25", "50", "100"]}
          onChange={handlePageChange}
          onShowSizeChange={(current, size) => handlePageChange(1, size)}
        />
      </div>
    </div>
  );
}
