import React, { Component } from "react";
import { Table } from "antd";
import { inject, observer } from "mobx-react";
import merge from "lodash/merge";
import { get } from "../utils";
import {
  ALL_BLOCKS_API_URL,
  PAGE_SIZE,
  BLOCKS_LIST_COLUMNS
} from "../constants";

import "./blocks.styles.less";

@inject("appIncrStore")
@observer
export default class BlcoksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.appIncrStore.blockList.blocks.toJSON(),
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
    const storeBlocks = this.props.appIncrStore.blockList;
    this.setState({
      loading: true
    });

    const data = await get(ALL_BLOCKS_API_URL, {
      order: "desc",
      ...params
    });

    const pagination = { ...this.state.pagination };
    if (data && data.blocks.length) {
      let res = data.blocks;
      // make sure page === 0 , pagination total merge increament blocks length of appIncrStore
      // when page === 0, blocks concat fetch data
      if (params.page === 0) {
        pagination.total = storeBlocks.total + data.total;
        res = merge(storeBlocks.blocks.toJSON(), (data.blocks);
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
