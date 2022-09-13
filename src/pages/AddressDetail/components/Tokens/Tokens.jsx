import { Table } from "antd";
import React, { useMemo } from "react";
import TableLayer from "../../../../components/TableLayer/TableLayer";
import useMobile from "../../../../hooks/useMobile";
import getColumn from "./columnConfig";

import "./Tokens.styles.less";

export default function Tokens({ balances, prices, dataLoading }) {
  const isMobile = useMobile();
  const columns = useMemo(() => {
    return getColumn({ prices, isMobile });
  }, [prices]);

  const sortedArr = useMemo(() => {
    const elf = balances.find((i) => i.symbol === "ELF");
    const other = balances.filter((i) => i.symbol !== "ELF");
    return [elf, ...other];
  }, [balances]);

  return (
    <div className="tokens-container tokens-pane">
      <div className="before-table">
        A total of {balances.length} tokens found
      </div>
      <TableLayer>
        <Table
          loading={dataLoading}
          dataSource={sortedArr}
          columns={columns}
          rowKey={(record = { symbol: "ELF" }) => record.symbol}
          pagination={false}
        />
      </TableLayer>
    </div>
  );
}
