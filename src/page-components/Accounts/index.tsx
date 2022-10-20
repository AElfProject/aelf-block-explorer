import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Pagination, Table } from 'antd';
import { useDebounce, useEffectOnce } from 'react-use';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import TableLayer from 'components/TableLayer/TableLayer';
import { get } from 'utils/axios/index';
import { defaultAElfInstance, getContract } from 'utils/utils';
import { getContractAddress } from 'page-components/Proposal/common/utils';
import getColumn from './columnConfig';
import { VIEWER_ACCOUNT_LIST } from 'constants/viewerApi';
require('./index.less');
export default function Accounts({ totalelfssr, datasourcessr, actualtotalssr, headers }) {
  let isMobile = !!isPhoneCheckSSR(headers);
  const [dataLoading, setDataLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState(datasourcessr);
  const [actualTotal, setActualTotal] = useState(actualtotalssr || 0);
  const [totalELF, setTotalELF] = useState(totalelfssr || 0);

  const total = useMemo(() => {
    if (actualTotal > 1000) return 1000;
    return actualTotal;
  }, [actualTotal]);

  const columns = useMemo(() => {
    return getColumn({
      isMobile,
      preTotal: Number(pageSize) * (pageIndex - 1),
    });
  }, [isMobile, pageIndex, pageSize]);

  const fetchAccountList = useCallback(async () => {
    const result = await get(VIEWER_ACCOUNT_LIST, {
      pageSize,
      pageNum: pageIndex,
      symbol: 'ELF',
    });
    if (result?.code === 0) {
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
  useEffect(() => {
    isMobile = !!isPhoneCheck();
  }, []);
  useEffectOnce(() => {
    const fetchData = async () => {
      const token = await getContract(defaultAElfInstance, getContractAddress('Token'));
      const result = await token.GetTokenInfo.call({
        symbol: 'ELF',
      });

      if (result) {
        setTotalELF(result.supply);
      }
    };
    fetchData();
  });

  useDebounce(
    () => {
      fetchAccountList();
    },
    1000,
    [pageIndex, pageSize],
  );

  return (
    <div className={clsx('accounts-page-container basic-container-new', isMobile && 'mobile')}>
      <h2>Top Accounts</h2>
      <div>
        <div className="before-table">
          <div className="left">
            <p>
              A total of {'>'} {Number(actualTotal).toLocaleString()} accounts found{' '}
              {`(${Number(totalELF / 100000000).toLocaleString()} ELF)`}
            </p>
            <p>(Showing the top 1,000 accounts only)</p>
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
            onShowSizeChange={(current, size) => handlePageChange(1, size)}
          />
        </div>
      </div>
    </div>
  );
}
