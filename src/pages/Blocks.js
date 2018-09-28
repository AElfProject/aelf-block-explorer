import React, { Component } from "react";
import { Table } from "antd";
import { get } from "../utils";
import {
  ALL_BLOCKS_API_URL,
  PAGE_SIZE,
  BLOCKS_LIST_COLUMNS
} from "../constants";

import "./blocks.styles.less";

export default class BlcoksPage extends Component {
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
    const { fetch } = this;
    await fetch({
      page: 0,
      limit: 25
    });
  }

  fetch = async (params = {}) => {
    this.setState({
      loading: true
    });

    const data = await get(ALL_BLOCKS_API_URL, {
      order: "desc",
      ...params
    });

    const pagination = { ...this.state.pagination };
    if (data && data.blocks.length) {
      pagination.total = data.total;
      this.setState({
        loading: false,
        data: data.blocks,
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
      <div className="blocks-page-container" key="body">
        <Table
          columns={BLOCKS_LIST_COLUMNS}
          dataSource={data}
          pagination={pagination}
          rowKey="block_hash"
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
    );
  }
}
