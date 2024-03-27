import { Pagination, Spin, Table } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDebounce } from "react-use";
import clsx from "clsx";
import { VIEWER_EVENT_LIST } from "../../../../api/url";
import EventItem from "../../../../components/EventItem";
import TableLayer from "../../../../components/TableLayer/TableLayer";
import useMobile from "../../../../hooks/useMobile";
import { get } from "../../../../utils";

import "./Events.styles.less";
import { getOriginAddress } from "../../../../utils/addressFormat";

export default function Events() {
  const { address: prefixAddress } = useParams();
  const address = getOriginAddress(prefixAddress);
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
        width: 192,
        ellipsis: true,
        dataIndex: "txId",
        className: "color-blue",
        render(txId) {
          return <Link to={`/tx/${txId}`}>{txId}</Link>;
        },
      },
      { title: "Log Event", width: 196, ellipsis: true, dataIndex: "name" },
      {
        title: "Logs",
        dataIndex: "data",
        render(data, record) {
          return (
            <EventItem
              Indexed={data.Indexed}
              NonIndexed={data.NonIndexed}
              Name={record.name}
              Address={prefixAddress}
            />
          );
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
      setDataSource(result.data.list);
      setTotal(result.data.total);
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
    <div className={clsx("events-pane", isMobile && "mobile")}>
      {isMobile ? (
        <div className="list">
          {dataLoading ? (
            <Spin />
          ) : (
            dataSource?.map((item) => (
              <div className="row">
                <p>
                  <span className="label">Txn Hash</span>
                  <span className="value">
                    <Link to={`/tx/${item.txId}`}>{item.txId}</Link>
                  </span>
                </p>
                <p>
                  <span className="label">Log Event</span>
                  <span className="value">{item.name}</span>
                </p>
                <p>
                  <span className="label">Logs</span>
                  <EventItem
                    Indexed={item.data.Indexed}
                    NonIndexed={item.data.NonIndexed}
                    Name={item.name}
                    Address={prefixAddress}
                  />
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        <TableLayer>
          <Table
            columns={columns}
            pagination={false}
            dataSource={dataSource}
            loading={dataLoading}
            rowKey="id"
          />
        </TableLayer>
      )}
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
