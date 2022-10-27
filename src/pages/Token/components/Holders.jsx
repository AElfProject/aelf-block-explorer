import { Pagination, Table } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDebounce } from "react-use";
import useMobile from "../../../hooks/useMobile";
import TableLayer from "../../../components/TableLayer/TableLayer";
import AddressLink from "../../../components/AddressLink";
import { get } from "../../../utils";
import { VIEWER_ACCOUNT_LIST } from "../../../api/url";
import { numberFormatter } from "../../../utils/formater";

export default function Holders() {
  const isMobile = useMobile();
  const nav = useNavigate();
  const { symbol } = useParams();
  const [dataLoading, setDataLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState(undefined);
  const [actualTotal, setActualTotal] = useState(0);

  const preTotal = useMemo(
    () => pageSize * (pageIndex - 1),
    [pageIndex, pageSize]
  );

  const columns = useMemo(
    () => [
      {
        title: "Rank",
        width: isMobile ? 96 : 196,
        dataIndex: "id",
        render(id, record, index) {
          return preTotal + index + 1;
        },
      },
      {
        title: "Address",
        width: isMobile ? 216 : 280,
        ellipsis: true,
        dataIndex: "owner",
        render(address) {
          return (
            <div className="address">
              <AddressLink address={address} />
            </div>
          );
        },
      },
      {
        title: "Balance",
        width: isMobile ? 156 : 280,
        dataIndex: "balance",
        render(balance) {
          return `${numberFormatter(balance)} ${symbol}`;
        },
      },
      {
        title: "Percentage",
        width: isMobile ? 116 : 180,
        dataIndex: "percentage",
      },
      {
        title: "Transfer",
        width: isMobile ? 82 : 152,
        dataIndex: "count",
        align: "right",
      },
    ],
    [isMobile, preTotal]
  );

  const fetch = useCallback(async () => {
    setDataLoading(true);
    setDataSource(undefined);
    const result = await get(VIEWER_ACCOUNT_LIST, {
      symbol,
      pageSize,
      pageNum: pageIndex,
    });
    setDataLoading(false);
    if (result.code === 0) {
      setDataSource(result.data.list);
      setActualTotal(result.data.total);
    } else {
      nav("/search-failed");
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
      fetch();
    },
    300,
    [fetch]
  );

  return (
    <div className="holders-pane">
      <TableLayer>
        <Table
          columns={columns}
          loading={dataLoading}
          dataSource={dataSource}
          rowKey="owner"
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
