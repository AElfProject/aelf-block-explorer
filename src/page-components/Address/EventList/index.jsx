/**
 * @file event list
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination, message } from 'antd';
import EventItem from '../EventItem';
import { request } from 'utils/request';
import config from 'constants/viewerApi';
import { sendHeight } from 'utils/utils';
import Total from 'components/Total';
import TableLayer from 'components/TableLayer/TableLayer';

const columns = [
  {
    title: 'TxId',
    dataIndex: 'txId',
    key: 'txId',
    width: 120,
    ellipsis: true,
    render(txId) {
      return (
        <a title={txId} href={`${config.viewer.txUrl}/${txId}`} target="_blank" rel="noopener noreferrer">
          {txId}
        </a>
      );
    },
  },
  {
    title: 'Method',
    dataIndex: 'name',
    key: 'name',
    width: 160,
    ellipsis: true,
  },
  {
    title: 'Logs',
    dataIndex: 'data',
    key: 'data',
    render(data, record) {
      return <EventItem data={data} name={record.name} address={record.address} />;
    },
  },
];

const fetchingStatusMap = {
  FETCHING: 'fetching',
  ERROR: 'error',
  SUCCESS: 'success',
};

const EventList = (props) => {
  const { contractAddress } = props;
  const [list, setList] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useState(fetchingStatusMap.FETCHING);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1,
    showSizeChanger: false,
  });

  const getList = (pager) => {
    setFetchingStatus(fetchingStatusMap.FETCHING);
    request(
      config.API_PATH.GET_EVENT_LIST,
      {
        ...pager,
        address: contractAddress,
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
    <>
      <TableLayer>
        <Table
          showSorterTooltip={false}
          dataSource={list}
          columns={columns}
          loading={fetchingStatus === fetchingStatusMap.FETCHING}
          rowKey="id"
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
    </>
  );
};

EventList.propTypes = {
  contractAddress: PropTypes.string.isRequired,
};

export default React.memo(EventList);
