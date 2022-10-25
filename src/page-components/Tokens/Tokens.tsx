import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Pagination, Table } from 'antd';
import { useDebounce } from 'react-use';
import clsx from 'clsx';
import TableLayer from 'components/TableLayer/TableLayer';
import getColumnConfig from './columnConfig';
import { get } from 'utils/axios';
import { VIEWER_GET_ALL_TOKENS } from 'constants/api';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';

require('./index.less');

export default function Tokens({ actualtotalssr: actualTotalSSR, datasourcessr: dataSourceSSR, headers }) {
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(headers));
  const [dataLoading, setDataLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState(dataSourceSSR);
  const [actualTotal, setActualTotal] = useState(actualTotalSSR || 0);

  const preTotal = useMemo(() => pageSize * (pageIndex - 1), [pageSize, pageIndex]);

  const columns = useMemo(() => getColumnConfig(isMobile, preTotal), [isMobile, preTotal]);

  const fetchData = useCallback(async () => {
    const result = await get(VIEWER_GET_ALL_TOKENS, {
      pageSize,
      pageNum: pageIndex,
    });
    if (result.code === 0) {
      const { data } = result;
      setActualTotal(data.total);
      setDataSource(data.list);
    } else {
      setDataSource(undefined);
    }
    setDataLoading(false);
  }, [pageIndex, pageSize]);

  const handlePageChange = useCallback(
    (page, size) => {
      setDataSource(undefined);
      setDataLoading(true);
      setPageIndex(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize],
  );

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);

  useDebounce(
    () => {
      fetchData();
    },
    300,
    [pageIndex, pageSize],
  );

  return (
    <div className={clsx('tokens-page-container basic-container-new', isMobile && 'mobile')}>
      <h2>Tokens</h2>
      <div className="before-table">
        <div className="left">
          <p>A total of {Number(actualTotal).toLocaleString()} Token Contracts found</p>
        </div>
        <div className="right">
          <Pagination
            showLessItems={isMobile}
            showSizeChanger={false}
            current={pageIndex}
            pageSize={pageSize}
            total={actualTotal}
            onChange={handlePageChange}
          />
        </div>
      </div>
      <TableLayer>
        <Table loading={dataLoading} columns={columns} rowKey="id" dataSource={dataSource} pagination={false} />
      </TableLayer>
      <div className="after-table">
        <Pagination
          showLessItems={isMobile}
          showSizeChanger
          current={pageIndex}
          pageSize={pageSize}
          total={actualTotal}
          pageSizeOptions={['25', '50', '100']}
          onChange={handlePageChange}
          onShowSizeChange={(_, size) => handlePageChange(1, size)}
        />
      </div>
    </div>
  );
}
