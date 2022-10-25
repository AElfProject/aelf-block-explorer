import { Pagination, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import { ALL_BLOCKS_API_URL, ALL_UNCONFIRMED_BLOCKS_API_URL } from 'constants/api';
import { get } from 'utils/axios';
import ColumnConfig from './columnConfig';
import { useRouter } from 'next/router';
import TableLayer from 'components/TableLayer/TableLayer';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import { IBlocksResult } from 'page-components/Home/types';

require('./BlockList.styles.less');

interface IProps {
  headers: any;
  allssr: number;
  datasourcessr: any;
}
export default function BlockList({ allssr: allSSR, datasourcessr: dataSourceSSR, headers }: IProps) {
  const { pathname = '' } = useRouter();
  const [timeFormat, setTimeFormat] = useState('Age');
  const [all, setAll] = useState(allSSR);
  const [dataSource, setDataSource] = useState(dataSourceSSR);
  const [dataLoading, setDataLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(headers));
  // judge whether is confirmed
  const pageTitle = useMemo(() => (pathname.includes('unconfirmed') ? 'Unconfirmed Blocks' : 'Blocks'), [pathname]);
  const isConfirmed = useMemo(() => pathname.includes('unconfirmed'), [pathname]);
  const api = useMemo(() => {
    return pathname.indexOf('unconfirmed') === -1 ? ALL_BLOCKS_API_URL : ALL_UNCONFIRMED_BLOCKS_API_URL;
  }, [pathname]);

  const fetch = useCallback(
    async (pageIndex) => {
      setDataLoading(true);
      setDataSource(undefined);
      const data: IBlocksResult = (await get(api, {
        order: 'desc',
        page: pageIndex - 1,
        limit: pageSize,
      })) as IBlocksResult;
      setAll(data ? data.total : 0);
      setDataLoading(false);
      setDataSource(data && data.blocks.length ? data.blocks : null);
    },
    [api, pageSize],
  );

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
    if (pageIndex === 1) {
      fetch(pageIndex);
    } else {
      // unconfirmed -> confirmed
      setPageIndex(1);
    }
  }, [pathname]);

  useDebounce(
    () => {
      fetch(pageIndex);
    },
    300,
    [pageIndex, pageSize],
  );

  const handlePageChange = useCallback(
    (page, size) => {
      setPageIndex(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize],
  );

  const columns = useMemo(
    () =>
      ColumnConfig(
        timeFormat,
        () => {
          setTimeFormat(timeFormat === 'Age' ? 'Date Time' : 'Age');
        },
        headers,
      ),
    [timeFormat],
  );

  return (
    <div className={`blocks-page-container basic-container-new ${isMobile ? 'mobile' : ''}`} key="body">
      <h2>{pageTitle}</h2>
      <div>
        <div className="before-table">
          <div className="left">
            <p>
              Total of {Number(all).toLocaleString()} {isConfirmed ? 'Unconfirmed Blocks' : 'Confirmed Blocks'}
            </p>
          </div>
          <div className="right">
            <Pagination
              showLessItems={isMobile}
              showSizeChanger={false}
              current={pageIndex}
              pageSize={pageSize}
              total={all}
              onChange={handlePageChange}
            />
          </div>
        </div>
        <TableLayer className="block-table" headers={headers}>
          <Table
            loading={dataLoading}
            columns={columns}
            rowKey="block_height"
            dataSource={dataSource}
            pagination={false}
          />
        </TableLayer>
        <div className="after-table">
          <Pagination
            showLessItems={isMobile}
            showSizeChanger
            current={pageIndex}
            pageSize={pageSize}
            total={all}
            pageSizeOptions={['25', '50', '100']}
            onChange={handlePageChange}
            onShowSizeChange={(current, size) => handlePageChange(1, size)}
          />
        </div>
      </div>
    </div>
  );
}
