/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-10-26 17:52:33
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-27 11:32:05
 * @FilePath: /aelf-block-explorer/src/page-components/ResourceDetail/ResourceDetail.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @file ResourceDetail
 * @author zhouminghui
 */

import { PureComponent } from 'react';
import { Table } from 'antd';
import { get } from 'utils/axios';
import { RESOURCE_RECORDS, RESOURCE_DETAILS_COLUMN, PAGE_SIZE, ELF_DECIMAL } from 'constants/index';
require('./ResourceDetail.less');
import { withRouter } from 'next/router';
import TableLayer from 'components/TableLayer/TableLayer';

const page = 0;
class ResourceDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      address: window.location.pathname.split('/')[2] || '',
      data: null,
      pagination: {
        pageSize: PAGE_SIZE,
        showSizeChanger: false,
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
      order: 'desc',
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
      <div className="transaction-details basic-container basic-container-white">
        <TableLayer>
          <Table
            showSorterTooltip={false}
            columns={RESOURCE_DETAILS_COLUMN}
            pagination={pagination}
            dataSource={data}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 1024 }}
          />
        </TableLayer>
      </div>
    );
  }
}
export default withRouter(ResourceDetail);
