/**
 * @file account list
 * @author atom-yang
 */
import React, { useMemo, useState, useEffect } from 'react';
import { message, Pagination, Table, Input } from 'antd';
import Link from 'next/link';
import { request } from 'utils/request';
import config from 'constants/viewerApi';
import Total from 'components/Total';
import { sendHeight } from 'utils/utils';
import Bread from 'page-components/Address/Bread';
require('./index.less');
import TableLayer from 'components/TableLayer/TableLayer';
import withNoSSR from 'utils/withNoSSR';

function getListColumn(preTotal) {
  return [
    {
      title: 'Rank',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render(id, record, index) {
        return preTotal + index + 1;
      },
    },
    {
      title: 'Token',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol) => <Link href={`/token/${symbol}`}>{symbol}</Link>,
    },
    {
      title: 'Total Supply',
      dataIndex: 'totalSupply',
      key: 'totalSupply',
      render(totalSupply, record) {
        return `${totalSupply} ${record.symbol}`;
      },
    },
    {
      title: 'Circulating Supply',
      dataIndex: 'supply',
      key: 'supply',
      render(supply, record) {
        return `${supply} ${record.symbol}`;
      },
    },
    {
      title: 'Holders',
      dataIndex: 'holders',
      key: 'holders',
    },
    {
      title: 'Transfers',
      dataIndex: 'transfers',
      key: 'transfers',
    },
  ];
}

const fetchingStatusMap = {
  FETCHING: 'fetching',
  ERROR: 'error',
  SUCCESS: 'success',
};

const { Search } = Input;

const TokenList = () => {
  const [list, setList] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useState(fetchingStatusMap.FETCHING);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1,
    showSizeChanger: false,
  });
  const columns = useMemo(() => getListColumn(pagination.pageSize * (pagination.pageNum - 1)), [pagination]);

  const getList = (pager) => {
    setFetchingStatus(fetchingStatusMap.FETCHING);
    request(
      config.API_PATH.GET_ALL_TOKENS,
      {
        ...pager,
      },
      {
        method: 'GET',
      },
    )
      .then((result) => {
        setFetchingStatus(fetchingStatusMap.SUCCESS);
        const { list: resultList, total } = result;
        setList(resultList);
        setPagination({
          ...pager,
          total,
        });
        sendHeight(500);
      })
      .catch((e) => {
        sendHeight(500);
        setFetchingStatus(fetchingStatusMap.ERROR);
        console.error(e);
        message.error('Network error');
      });
  };

  const onSearch = (value) => {
    const newPagination = {
      ...pagination,
      pageNum: 1,
      search: (value || '').trim(),
    };
    getList(newPagination);
  };

  useEffect(() => {
    getList(pagination);
  }, []);

  const onPageNumChange = (page, pageSize) => {
    const newPagination = {
      ...pagination,
      pageNum: page,
      pageSize,
    };
    getList(newPagination);
  };

  return (
    <div className="token-list-container main-container">
      <Bread title="Token List" />
      <div className="contract-list-search gap-bottom">
        <h2>&nbsp;</h2>
        <Search
          className="contract-list-search-input"
          placeholder="Input token symbol"
          size="large"
          onSearch={onSearch}
        />
      </div>
      <TableLayer className="token-list-content">
        <Table
          showSorterTooltip={false}
          dataSource={list}
          columns={columns}
          loading={fetchingStatus === fetchingStatusMap.FETCHING}
          rowKey="symbol"
          pagination={false}
        />
      </TableLayer>
      <div className="account-list-pagination gap-top float-right">
        <Pagination
          showQuickJumper
          total={pagination.total}
          current={pagination.pageNum}
          pageSize={pagination.pageSize}
          hideOnSinglePage
          showSizeChanger={false}
          onChange={onPageNumChange}
          showTotal={Total}
        />
      </div>
    </div>
  );
};

export default React.memo(withNoSSR(TokenList));
