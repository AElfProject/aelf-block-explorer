import React, { Component } from "react";
import { Table } from "antd";
import { get } from "../utils";
import {
  ALL_TXS_API_URL,
  TXS_BLOCK_API_URL,
  PAGE_SIZE,
  ALL_TXS_LIST_COLUMNS
} from "../constants";

import "./txs.styles.less";

export default class TxsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
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
      pagination.total = data.total;
      this.setState({
        loading: false,
        data: data.transactions,
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
