import { Table } from 'antd';
import React, { useMemo, useEffect, useState } from 'react';
import TableLayer from 'components/TableLayer/TableLayer';
import getColumn from './columnConfig';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
require('./Tokens.styles.less');

export default function Tokens({ balances, prices, dataLoading, headers }) {
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(headers));

  const columns = useMemo(() => {
    return getColumn({ prices, isMobile });
  }, [prices]);

  const sortedArr = useMemo(() => {
    const elf = balances.find((i) => i.symbol === 'ELF');
    const other = balances.filter((i) => i.symbol !== 'ELF');
    return [elf, ...other];
  }, [balances]);

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);

  return (
    <div className="tokens-container tokens-pane">
      <div className="before-table">A total of {balances.length} tokens found</div>
      <TableLayer>
        <Table
          loading={dataLoading}
          dataSource={sortedArr}
          columns={columns}
          rowKey={(record = { symbol: 'ELF' }) => record.symbol}
          pagination={false}
        />
      </TableLayer>
    </div>
  );
}
