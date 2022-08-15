import React, { Component } from "react";
import { Table } from "antd";
import { get } from "../../utils";
import {
  ALL_BLOCKS_API_URL,
  ALL_UNCONFIRMED_BLOCKS_API_URL,
  PAGE_SIZE,
  BLOCKS_LIST_COLUMNS,
} from "../../constants";

import "./blocks.styles.less";
import { withRouter } from "../../routes/utils";

class BlocksPage extends Component {
  constructor(props) {
    super(props);
    const { location } = props;
    const { pathname = "" } = location;
    this.API_URL =
      pathname.indexOf("unconfirmed") === -1
        ? ALL_BLOCKS_API_URL
        : ALL_UNCONFIRMED_BLOCKS_API_URL;
    this.state = {
      data: [],
      pagination: {
        showQuickJumper: true,
        pageSize: PAGE_SIZE,
        total: 0,
        showTotal: (total) => `Total ${total} items`,
        onChange: () => {
          window.scrollTo(0, 0);
        },
      },
      loading: false,
    };
  }

  componentDidMount() {
    this.fetch({
      page: 0,
      limit: PAGE_SIZE,
    });
  }

  fetch = async (params = {}) => {
    // const storeBlocks = this.props.appIncrStore.blockList;
    this.setState({
      loading: true,
    });

    const data = await get(this.API_URL, {
      order: "desc",
      ...params,
    });

    let pagination = this.state.pagination;
    pagination.total = data.total;

    this.setState({
      loading: false,
      data: data && data.blocks.length ? data.blocks : null,
      pagination,
    });
  };

  handleTableChange = async (pagination) => {
    const pager = {
      ...this.state.pagination,
    };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    await this.fetch({
      limit: pagination.pageSize,
      page: pagination.current - 1,
    });
  };

  render() {
    const { data, pagination, loading } = this.state;
    const { handleTableChange } = this;

    return (
      <div
        className='blocks-page-container basic-container basic-container-white'
        key='body'
      >
        <Table
          columns={BLOCKS_LIST_COLUMNS}
          dataSource={data}
          pagination={pagination}
          rowKey='block_hash'
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 414 }}
        />
      </div>
    );
  }
}

export default withRouter(BlocksPage);
