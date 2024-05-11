import { Table, Pagination } from "antd";
import React, { useMemo } from "react";
import TableLayer from "../../../../components/TableLayer/TableLayer";
import useMobile from "../../../../hooks/useMobile";
import getColumn from "./columnConfig";

import "./Tokens.styles.less";
import { symbolListToTokenName } from '../../../../utils/formater';

export default function Tokens({ balances, prices, dataLoading, pagination }) {
  const isMobile = useMobile();
  const columns = useMemo(() => {
    return getColumn({ prices, isMobile });
  }, [prices]);
  const { pageNum, pageSize, total, handlePageChange } = pagination;
  const sortedArr = useMemo(() => {
    const elf = balances?.find((i) => i.symbol === "ELF");
    const other = balances?.filter((i) => i.symbol !== "ELF");
    if (!elf && other?.length) {
      return other;
    }
    const list = [elf,...other];
    symbolListToTokenName(list)
    return list;
  }, [balances]);

  return (
    <div className="tokens-container tokens-pane">
      <div className="before-table">
        A total of {balances?.length} tokens found
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
      <div className="after-table">
        <Pagination
          showLessItems={isMobile}
          showSizeChanger
          current={pageNum}
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
