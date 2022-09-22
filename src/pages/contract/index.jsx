/**
 * @file contract list
 * @author atom-yang
 */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Divider, message, Pagination, Table, Tag, Input, Tooltip } from 'antd';
import Link from 'next/link';
import { request } from 'utils/request';
import config, { API_PATH } from 'constants/viewerApi';
import Total from 'components/Total';
require('./index.less');
import { removePrefixOrSuffix, removeAElfPrefix, sendHeight } from 'utils/utils';
import Bread from 'page-components/Address/Bread';
import TableLayer from 'components/TableLayer/TableLayer';

const { Search } = Input;

const ListColumn = [
  {
    title: <span title="Contract Name">Name</span>,
    dataIndex: 'contractName',
    key: 'contractName',
    ellipsis: true,
    width: 120,
    render: (name, record) =>
      name && +name !== -1 ? (
        <Link href={`/contract/${record.address}`} title={name}>
          <Tooltip title={name} placement="topLeft">
            {removeAElfPrefix(name)}
          </Tooltip>
        </Link>
      ) : (
        <>'-'</>
      ),
  },
  {
    title: 'Contract Address',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
    width: 320,
    render: (address) => (
      <Link href={`/contract/${address}`} title={`ELF_${address}_${config.viewer.chainId}`}>
        {`ELF_${address}_${config.viewer.chainId}`}
      </Link>
    ),
  },
  {
    title: <span title="Contract Type">Type</span>,
    dataIndex: 'isSystemContract',
    key: 'isSystemContract',
    ellipsis: true,
    render: (isSystemContract) => (
      <Tag color={isSystemContract ? 'green' : 'blue'}>{isSystemContract ? 'System' : 'User'}</Tag>
    ),
  },
  {
    title: 'Version',
    dataIndex: 'version',
    key: 'version',
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
    ellipsis: true,
    width: 320,
    render: (address) => (
      <a href={`${config.viewer.addressUrl}/${address}`} target="_blank" rel="noopener noreferrer">
        {`ELF_${address}_${config.viewer.chainId}`}
      </a>
    ),
  },
  {
    title: 'Last Updated At',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 150,
    render(text) {
      return moment(text).format('YYYY/MM/DD HH:mm:ss');
    },
  },
];

const fetchingStatusMap = {
  FETCHING: 'fetching',
  ERROR: 'error',
  SUCCESS: 'success',
};

const ContractList = () => {
  const [list, setList] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useState(fetchingStatusMap.FETCHING);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1,
  });

  const getList = (pager) => {
    setFetchingStatus(fetchingStatusMap.FETCHING);
    request(API_PATH.GET_LIST, pager, {
      method: 'GET',
    })
      .then((result) => {
        setFetchingStatus(fetchingStatusMap.SUCCESS);
        const { list: resultList, total } = result;
        setList(resultList);
        setPagination({
          ...pager,
          total,
        });
        sendHeight();
      })
      .catch((e) => {
        setFetchingStatus(fetchingStatusMap.ERROR);
        console.error(e);
        sendHeight();
        message.error('Network error');
      });
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

  const onShowSizeChange = (current, size) => {
    const newPagination = {
      ...pagination,
      pageNum: 1,
      pageSize: size,
    };
    getList(newPagination);
  };

  const onSearch = (value) => {
    const newPagination = {
      ...pagination,
      pageNum: 1,
      address: removePrefixOrSuffix(value),
    };
    getList(newPagination);
  };

  return (
    <div className="contract-list">
      <Bread title="Contract List" />
      <div className="contract-list-search">
        <h2>&nbsp;</h2>
        <Search
          className="contract-list-search-input"
          placeholder="Input contract address"
          size="large"
          onSearch={onSearch}
        />
      </div>
      <Divider />
      <TableLayer className="contract-list-content">
        <Table
          showSorterTooltip={false}
          dataSource={list}
          columns={ListColumn}
          loading={fetchingStatus === fetchingStatusMap.FETCHING}
          rowKey="address"
          pagination={false}
        />
      </TableLayer>
      <div className="contract-list-pagination">
        <Pagination
          showQuickJumper
          total={pagination.total}
          current={pagination.pageNum}
          pageSize={pagination.pageSize}
          showSizeChanger
          onChange={onPageNumChange}
          showTotal={Total}
          onShowSizeChange={onShowSizeChange}
        />
      </div>
    </div>
  );
};

export default React.memo(ContractList);
