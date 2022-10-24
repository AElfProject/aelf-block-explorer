import React, { useCallback, useMemo, useState, useEffect } from 'react';
import clsx from 'clsx';
import { Pagination, Table } from 'antd';
import { useDebounce } from 'react-use';
import TableLayer from 'components/TableLayer/TableLayer';
import { get } from 'utils/axios';
import getColumn from './columnConfig';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import { VIEWER_CONTRACTS_LIST } from 'constants/viewerApi';
require('./index.less');

export default function Contracts({ actualtotalssr, datasourcessr, headers }) {
  const [dataLoading, setDataLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState(datasourcessr);
  const [actualTotal, setActualTotal] = useState(actualtotalssr || 0);
  let isMobile = !!isPhoneCheckSSR(headers);
  useEffect(() => {
    isMobile = !!isPhoneCheck();
  }, []);
  const total = useMemo(() => {
    if (actualTotal > 1000) return 1000;
    return actualTotal;
  }, [actualTotal]);

  const columns = useMemo(() => {
    return getColumn({
      isMobile,
    });
  }, [isMobile, pageIndex, pageSize]);

  const fetchContractList = useCallback(async () => {
    const result = await get(VIEWER_CONTRACTS_LIST, {
      pageSize,
      pageNum: pageIndex,
    });
    if (result.code === 0) {
      const { data } = result;
      setActualTotal(data.total);
      setDataSource(data.list);
      setDataLoading(false);
    } else {
      // when error
      setDataSource(undefined);
      setDataLoading(false);
    }
  }, [pageSize, pageIndex]);

  const handlePageChange = useCallback(
    (page, size) => {
      setDataSource(undefined);
      setDataLoading(true);
      setPageIndex(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize],
  );

  useDebounce(
    () => {
      fetchContractList();
    },
    1000,
    [pageIndex, pageSize],
  );

  return (
    <div className={clsx('contracts-page-container basic-container-new', isMobile && 'mobile')}>
      <h2>Contracts</h2>
      <div>
        <div className="before-table">
          <div className="left">
            <p>
              A total of {'>'} {Number(actualTotal).toLocaleString()} contracts found
            </p>
            <p>(Showing the last 1,000 contracts only)</p>
          </div>
          <div className="right">
            <Pagination
              showLessItems={isMobile}
              showSizeChanger={false}
              current={pageIndex}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
            />
          </div>
        </div>
        <TableLayer className="block-table">
          <Table loading={dataLoading} columns={columns} rowKey="owner" dataSource={dataSource} pagination={false} />
        </TableLayer>
        <div className="after-table">
          <Pagination
            showLessItems={isMobile}
            showSizeChanger
            current={pageIndex}
            pageSize={pageSize}
            total={total}
            pageSizeOptions={['25', '50', '100']}
            onChange={handlePageChange}
            onShowSizeChange={(_, size) => handlePageChange(1, size)}
          />
        </div>
      </div>
    </div>
  );
}
