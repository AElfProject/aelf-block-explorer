/**
 * @file Address.js
 * @author huangzongzhe, longyue, yangpeiyang
 */
import React from 'react';
import {message, Table} from 'antd';

import { get } from '../../utils';
import {
  ALL_TXS_LIST_COLUMNS,
  ADDRESS_TXS_API_URL,
  PAGE_SIZE,
} from '../../constants';
import {ADDRESS_INFO} from '../../../config/config';
import './address.styles.less';

export default class AddressPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.match.params.id,
      txs: [],
      pagination: {
        pageSize: PAGE_SIZE,
        showQuickJumper: true,
        showTotal: total => `Total ${total} items`,
        onChange: () => {
          window.scrollTo(0, 0);
        },
        current: 1
      },
      loading: false
    };
  }

  fetch = async (params = {}) => {
    this.setState({
      loading: true
    });

    try {
      const data = await get(ADDRESS_TXS_API_URL, {
        order: 'desc',
        ...params
      });

      this.setState({
        pagination: {
          ...this.state.pagination,
          total: data.total
        },
        txs: data.transactions || [],
        loading: false
      });
    } catch (e) {
      console.error(e);
      message.error('Network Error');
      this.setState({
        pagination: {
          ...this.state.pagination,
          current: 1,
          total: 0
        },
        txs: [],
        loading: false
      });
    }
  };

  handlePagination = page => {
    const {
      pagination
    } = this.state;
    const newPage = {
      ...pagination,
      ...page
    };
    const {
      match
    } = this.props;
    this.setState({
      pagination: newPage
    });

    return this.fetch({
      limit: newPage.pageSize,
      page: newPage.current - 1,
      address: match.params.id
    });
  };

  componentDidMount() {
    this.handlePagination({
      current: 1
    })
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps);
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.handlePagination({
        current: 1
      });
    }
  }

  render() {
    const { address, txs, pagination, loading } = this.state;

    return (
      <div className='address-container basic-container basic-container-white' key='body'>
        <h3 className='address-context'>{ADDRESS_INFO.PREFIX + '_' + address + '_' + ADDRESS_INFO.CURRENT_CHAIN_ID}</h3>
        <h3 className='transaction-counts'>
          {(this.state.pagination.total && this.state.pagination.total.toLocaleString()) || '-'}{' '}
          交易
        </h3>
        <Table
          columns={ALL_TXS_LIST_COLUMNS}
          dataSource={txs}
          pagination={pagination}
          rowKey='tx_id'
          loading={loading}
          onChange={this.handlePagination}
          scroll={{ x: 1024 }}
        />
      </div>
    );
  }
}
