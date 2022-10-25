import { Pagination } from 'antd';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import TransactionTable from 'components/TransactionTable/TransactionTable';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import { Itx } from '../types';

export default function TransactionList({
  allData = [],
  headers,
  price,
}: {
  allData: Itx[];
  headers: any;
  price: object;
}) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(headers));

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);
  const dataSource = useMemo(() => {
    return allData.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
  }, [pageIndex, pageSize, allData]);
  const handlePageChange = useCallback(
    (page, size) => {
      setPageIndex(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize],
  );
  return (
    <div>
      <TransactionTable dataLoading={!allData.length} dataSource={dataSource} headers={headers} price={price} />
      <div className="after-table">
        <Pagination
          showLessItems={isMobile}
          showSizeChanger
          current={pageIndex}
          pageSize={pageSize}
          total={allData.length}
          pageSizeOptions={['10', '25', '50', '100']}
          onChange={handlePageChange}
          onShowSizeChange={(_, size) => handlePageChange(1, size)}
        />
      </div>
    </div>
  );
}
