import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Table } from 'antd';

import {
  NODE_DEFAULT_NAME,
  FROM_ACTIVE_VOTES
} from '@src/pages/Vote/constants';

const { Search } = Input;
const clsPrefix = 'my-vote-records';

const myVoteRecordsCols = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank'
  },
  {
    title: 'Node Name',
    dataIndex: 'name',
    key: 'nodeName',
    render: (text, record) => (
      <Link
        to={{ pathname: '/vote/team', search: `pubkey=${record.candidate}` }}
      >
        {text}
      </Link>
    )
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Vote Amount',
    dataIndex: 'amount',
    key: 'voteAmount',
    sorter: (a, b) => a.amount - b.amount
  },
  {
    title: 'Lock Time',
    dataIndex: 'formatedLockTime',
    key: 'formatedLockTime'
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status'
  },
  {
    title: 'Operation Time',
    dataIndex: 'operationTime',
    key: 'operationTime',
    defaultSortOrder: 'descend',
    sorter: (a, b) => {
      let prev = null;
      let next = null;
      prev = a.withdrawTimestamp
        ? a.withdrawTimestamp.seconds
        : a.voteTimestamp.seconds;
      next = b.withdrawTimestamp
        ? b.withdrawTimestamp.seconds
        : b.voteTimestamp.seconds;

      return prev - next;
    }
  },
  {
    title: 'Operations',
    key: 'operations',
    render: (text, record) => (
      <div className='node-list-btn-group'>
        <Button
          type='primary'
          data-role='vote'
          data-votetype={FROM_ACTIVE_VOTES}
          data-nodeaddress={record.candidate}
          data-nodename={record.nane || NODE_DEFAULT_NAME}
        >
          转投
        </Button>
      </div>
    )
  }
];

myVoteRecordsCols.forEach(item => {
  // eslint-disable-next-line no-param-reassign
  item.align = 'center';
});

const pagination = {
  showQuickJumper: true,
  total: 0,
  showTotal: total => `Total ${total} items`
};

class MyVoteRecords extends Component {
  render() {
    const { data } = this.props;

    return (
      <section>
        <h2 className={`${clsPrefix}-header`}>
          <span>节点列表</span>
          <span className='node-color-intro-group'>
            <span className='node-color-intro-item'>BP节点</span>
            <span className='node-color-intro-item'>候选节点</span>
          </span>
          <Search
            placeholder='输入节点名称'
            onSearch={value => console.log(value)}
          />
        </h2>
        <Table
          columns={myVoteRecordsCols}
          dataSource={data}
          // onChange={handleTableChange}
          // loading={loading}
          pagination={pagination}
          rowKey={record => record.voteId.value}
        />
      </section>
    );
  }
}

export default MyVoteRecords;
