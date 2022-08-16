/**
 * @file ResourceDetail
 * @author zhouminghui
 */

import React, { PureComponent } from "react";
import { Table } from "antd";
import { get } from "../../utils";
import {
  RESOURCE_RECORDS,
  RESOURCE_DETAILS_COLUMN,
  PAGE_SIZE,
  ELF_DECIMAL,
} from "../../constants";
import "./ResourceDetail.less";
import { withRouter } from "../../../routes/utils";

const page = 0;
class ResourceDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      address: props.params.id || "",
      data: null,
      pagination: {
        pageSize: PAGE_SIZE,
        showQuickJumper: true,
        total: 0,
        showTotal: (total) => `Total ${total} items`,
      },
    };
  }

  componentDidMount() {
    this.getResourceDetail(PAGE_SIZE, page);
  }

  async getResourceDetail(PAGE_SIZE, page) {
    const { address, pagination } = this.state;
    this.setState({
      loading: true,
    });
    const data = await get(RESOURCE_RECORDS, {
      limit: PAGE_SIZE,
      page,
      order: "desc",
      address,
    });
    const records = data.records || [];
    records.map((item, index) => {
      item.key = index + page;
      item.resource = (+item.resource / ELF_DECIMAL).toFixed(8);
    });
    pagination.total = data.total;
    this.setState({
      data: records,
      pagination,
      loading: false,
    });
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    this.getResourceDetail(pagination.pageSize, pagination.current - 1);
  };

  render() {
    const { pagination, data, loading } = this.state;
    const { handleTableChange } = this;
    return (
      <div className='transaction-details basic-container basic-container-white'>
        <Table
          columns={RESOURCE_DETAILS_COLUMN}
          pagination={pagination}
          dataSource={data}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1024 }}
        />
      </div>
    );
  }
}
export default withRouter(ResourceDetail);
