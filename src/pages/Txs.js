import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Table } from "antd";
import merge from "lodash/merge";
import { get } from "../utils";
import {
  ALL_TXS_API_URL,
  TXS_BLOCK_API_URL,
  PAGE_SIZE,
  ALL_TXS_LIST_COLUMNS
} from "../constants";

import "./txs.styles.less";

@inject("appIncrStore")
@observer
export default class TxsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.appIncrStore.txsList.transactions.toJSON(),
      pagination: {
        pageSize: PAGE_SIZE,
        showTotal: total => `Total ${total} items`
      },
      loading: false
    };
  }

  async componentDidMount() {
    const { fetch, props } = this;
    const { location } = props;
    await fetch({
      page: 0,
      limit: 25,
      block_hash: (!!location.search && location.search.slice(1)) || undefined
    });
  }

  fetch = async (params = {}) => {
    const storeTxs = this.props.appIncrStore.txsList;
    this.setState({
      loading: true
    });

    const url = !!params.block_hash ? TXS_BLOCK_API_URL : ALL_TXS_API_URL;
    const data = await get(url, {
      order: "desc",
      ...params
    });

    const pagination = { ...this.state.pagination };
    if (data && data.transactions.length) {
      let res = data.transactions;
      // make sure page === 0 , pagination total merge increament txs length of appIncrStore
      // when page === 0, txsList concat fetch data
      if (params.page === 0) {
        pagination.total = storeTxs.total + data.total;
        res = merge(storeTxs.transactions.toJSON(), data.transactions);
      }

      this.setState({
        loading: false,
        data: res,
        pagination
      });
    } else {
      this.setState({
        loading: false,
        data: null,
        pagination
      });
    }
  };

  handleTableChange = pagination => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });

    this.fetch({
      limit: pagination.pageSize,
      page: pagination.current - 1
    });
  };

  render() {
    const { data, pagination, loading } = this.state;
    const { handleTableChange } = this;

    return (
      <div className="txs-page-container" key="body">
        <Table
          columns={ALL_TXS_LIST_COLUMNS}
          dataSource={data}
          pagination={pagination}
          rowKey="tx_id"
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
    );
  }
}
