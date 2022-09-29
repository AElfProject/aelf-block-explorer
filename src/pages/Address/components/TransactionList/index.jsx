/**
 * @file transaction list
 * @author atom-yang
 */
import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Table, Pagination, message } from "antd";
import config from "../../../../common/config";
import {
  getContractNames,
  removeAElfPrefix,
  sendHeight,
} from "../../../../common/utils";
import Total from "../../../../components/Total";
import Dividends from "../../../../components/Dividends";
import AddressLink from "../AddressLink";
import TableLayer from "../../../../components/TableLayer/TableLayer";

function getTableColumns(contractNames, ownerAddress) {
  return [
    {
      title: "Tx Id",
      dataIndex: "txId",
      key: "txId",
      ellipsis: true,
      width: 250,
      render(txId) {
        return (
          <a
            title={txId}
            href={`${config.viewer.txUrl}/${txId}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            {txId}
          </a>
        );
      },
    },
    {
      title: "Height",
      dataIndex: "blockHeight",
      key: "blockHeight",
      render(height) {
        return (
          <a
            href={`${config.viewer.blockUrl}/${height}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            {height}
          </a>
        );
      },
    },
    {
      title: "Method",
      width: 200,
      dataIndex: "method",
      key: "method",
      ellipsis: true,
    },
    {
      title: "From",
      dataIndex: "addressFrom",
      key: "addressFrom",
      ellipsis: true,
      render(from) {
        return from === ownerAddress ? (
          `ELF_${from}_${config.viewer.chainId}`
        ) : (
          <AddressLink address={from} />
        );
      },
    },
    {
      title: "To",
      dataIndex: "addressTo",
      key: "addressTo",
      ellipsis: true,
      render(to) {
        let text = `ELF_${to}_${config.viewer.chainId}`;
        if (contractNames[to] && contractNames[to].contractName) {
          text = removeAElfPrefix(contractNames[to].contractName);
        }
        return to === ownerAddress ? (
          text
        ) : (
          <Link to={`/contract/${to}`} title={text}>
            {text}
          </Link>
        );
      },
    },
    {
      title: "Tx Fee",
      dataIndex: "txFee",
      key: "txFee",
      render(fee) {
        return <Dividends dividends={fee} />;
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 160,
      render(time) {
        return moment(time).format("YYYY/MM/DD HH:mm:ss");
      },
    },
  ];
}

function getList(api, params, formatter) {
  return axios
    .get(api, {
      params,
    })
    .then((res) => {
      const { data } = res;
      const { total = 0, list = [] } = formatter(data);
      return {
        total,
        list,
      };
    })
    .catch((e) => {
      console.error(e);
      return {
        total: 0,
        list: [],
      };
    });
}

const TransactionList = (props) => {
  const {
    api,
    requestParamsFormatter,
    responseFormatter,
    freezeParams,
    owner,
    getColumns,
    ...rest
  } = props;
  const [contractNames, setContractNames] = useState({});
  const columns = useMemo(
    () => getColumns(contractNames, owner),
    [contractNames, owner]
  );

  const [result, setResult] = useState({
    list: [],
    total: 0,
  });
  const [params, setParams] = useState({
    pageSize: 10,
    pageNum: 1,
    loading: false,
    ...freezeParams,
  });

  function fetch(apiParams) {
    setParams({
      ...params,
      loading: true,
    });
    getList(api, requestParamsFormatter(apiParams), responseFormatter)
      .then((res) => {
        const { list, total } = res;
        setResult({
          list,
          total,
        });
        setParams({
          ...params,
          ...apiParams,
          loading: false,
        });
        sendHeight(500);
      })
      .catch((e) => {
        sendHeight(500);
        console.error(e);
        message.error("Network error");
      });
  }

  useEffect(() => {
    fetch({
      ...params,
      ...freezeParams,
    });
    getContractNames().then((res) => setContractNames(res));
  }, [freezeParams, api, owner]);

  async function onPageChange(pageNum, pageSize) {
    await fetch({
      ...params,
      pageNum,
      pageSize,
    });
  }
  return (
    <div className='transaction-list'>
      <TableLayer>
        <Table
          showSorterTooltip={false}
          {...rest}
          dataSource={result.list}
          columns={columns}
          loading={params.loading}
          pagination={false}
        />
      </TableLayer>
      <Pagination
        className='float-right gap-top'
        showQuickJumper
        total={result.total}
        current={params.pageNum}
        pageSize={params.pageSize}
        hideOnSinglePage
        showSizeChanger={false}
        onChange={onPageChange}
        showTotal={Total}
      />
    </div>
  );
};

TransactionList.propTypes = {
  api: PropTypes.string.isRequired,
  responseFormatter: PropTypes.func,
  requestParamsFormatter: PropTypes.func,
  owner: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  freezeParams: PropTypes.object.isRequired,
  getColumns: PropTypes.func,
};

TransactionList.defaultProps = {
  requestParamsFormatter: (params) => params,
  responseFormatter: (response) => response.data,
  owner: "",
  getColumns: getTableColumns,
};

export default TransactionList;
