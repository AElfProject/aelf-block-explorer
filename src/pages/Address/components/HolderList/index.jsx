/**
 * @file account list
 * @author atom-yang
 */
import React, { useMemo, useState, useEffect } from "react";
import { message, Pagination, Table } from "antd";
import PropTypes from "prop-types";
import { request } from "../../../../common/request";
import config from "../../../../common/config";
import Total from "../../../../components/Total";
import { sendHeight } from "../../../../common/utils";
import AddressLink from "../AddressLink";

function getListColumn(preTotal) {
  return [
    {
      title: "Rank",
      dataIndex: "id",
      key: "id",
      width: 80,
      render(id, record, index) {
        return preTotal + index + 1;
      },
    },
    {
      title: "Address",
      dataIndex: "owner",
      key: "owner",
      ellipsis: true,
      render: (address) => <AddressLink address={address} />,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render(balance, record) {
        return `${Number(balance).toLocaleString()} ${record.symbol}`;
      },
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
    },
    {
      title: "Transfers",
      dataIndex: "count",
      key: "count",
    },
  ];
}

const fetchingStatusMap = {
  FETCHING: "fetching",
  ERROR: "error",
  SUCCESS: "success",
};

const HolderList = (props) => {
  const { symbol } = props;
  const [list, setList] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useState(
    fetchingStatusMap.FETCHING
  );
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1,
    showSizeChanger: false,
  });
  const columns = useMemo(
    () => getListColumn(pagination.pageSize * (pagination.pageNum - 1)),
    [pagination]
  );

  const getList = (pager) => {
    setFetchingStatus(fetchingStatusMap.FETCHING);
    request(
      config.API_PATH.GET_ACCOUNT_LIST,
      {
        ...pager,
        symbol,
      },
      {
        method: "GET",
      }
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
        message.error("Network error");
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
      <Table
        showSorterTooltip={false}
        dataSource={list}
        columns={columns}
        loading={fetchingStatus === fetchingStatusMap.FETCHING}
        rowKey='owner'
        pagination={false}
      />
      <div className='account-list-pagination gap-top float-right'>
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

HolderList.propTypes = {
  symbol: PropTypes.string.isRequired,
};

export default React.memo(HolderList);
