import { Table } from "antd";
import React, { useMemo, useState } from "react";
import { useEffectOnce } from "react-use";
import { ELF_REALTIME_PRICE_URL } from "../../constants";
import { get } from "../../utils";
import TableLayer from "../TableLayer/TableLayer";

import ColumnConfig from "./columnConfig";
import "./TransactionTable.styles.less";

export default function TransactionTable({ dataLoading, dataSource }) {
  const [price, setPrice] = useState(0);
  const [timeFormat, setTimeFormat] = useState("Age");

  const columns = useMemo(
    () =>
      ColumnConfig(timeFormat, price, () => {
        setTimeFormat(timeFormat === "Age" ? "Date Time" : "Age");
      }),
    [timeFormat, price]
  );

  useEffectOnce(() => {
    get(ELF_REALTIME_PRICE_URL, { fsym: "ELF", tsyms: "USD,BTC,CNY" }).then(
      (res) => setPrice(res)
    );
  });
  return (
    <TableLayer className="transaction-table">
      <Table
        loading={dataLoading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey="tx_id"
      />
    </TableLayer>
  );
}
