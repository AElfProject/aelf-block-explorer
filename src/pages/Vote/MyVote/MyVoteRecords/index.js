import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Input, Button, Table, Icon, Tooltip,
} from 'antd';

import {
  NODE_DEFAULT_NAME,
  FROM_ACTIVE_VOTES,
  RANK_NOT_EXISTED_SYMBOL,
} from '@src/pages/Vote/constants';
import publicKeyToAddress from '@utils/publicKeyToAddress';
import { centerEllipsis } from '@utils/formater';

import './MyVoteRecords.less';
import { ELF_DECIMAL } from '../../constants';

const { Search } = Input;
const clsPrefix = 'my-vote-records';

function genMyVoteRecordsCols() {
  const { isSmallScreen } = this.props;

  const myVoteRecordsCols = [
    {
      title: 'Rank',
      dataIndex: 'displayedRank',
      key: 'rank',
      width: 70,
      sorter: (a, b) => a.rank - b.rank,
    },
    {
      title: 'Node Name',
      dataIndex: 'name',
      key: 'nodeName',
      width: 250,
      ellipsis: true,
      ...this.getColumnSearchProps('name'),
      render: (text, record) => (
        <Tooltip title={text}>
          <Link
            to={{
              pathname: '/vote/team',
              search: `pubkey=${record.candidate}`,
            }}
          >
            {text}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 90,
    },
    {
      title: 'Vote Amount',
      dataIndex: 'amount',
      key: 'voteAmount',
      width: 100,
      sorter: (a, b) => a.amount - b.amount,
      render: (value) => value / ELF_DECIMAL,
    },
    {
      title: 'Lock Time',
      dataIndex: 'formattedLockTime',
      key: 'formattedLockTime',
    },
    {
      title: 'Unlock Time',
      ellipsis: true,
      dataIndex: 'formattedUnlockTime',
      key: 'formattedUnlockTime',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      width: 110,
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
      },
    },
    {
      title: 'Operations',
      key: 'operations',
      render: (text, record) => (
        <div className="node-list-btn-group">
          <Button
            type="primary"
            className="table-btn redeem-btn"
            data-role="redeemOne"
            data-nodeaddress={publicKeyToAddress(record.candidate)}
            data-nodename={record.nane || publicKeyToAddress(record.candidate)}
            data-amount={record.amount}
            disabled={!record.isRedeemable || record.type === 'Redeem'}
            data-shoulddetectlock
            data-voteId={JSON.stringify(record.voteId)}
          >
            Redeem
          </Button>
        </div>
      ),
    },
  ];

  // todo: Use css way
  if (isSmallScreen) {
    myVoteRecordsCols.pop();
  }

  myVoteRecordsCols.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.align = 'center';
  });
  return myVoteRecordsCols;
}

const pagination = {
  showQuickJumper: true,
  total: 0,
  showTotal: (total) => `Total ${total} items`,
};

class MyVoteRecords extends Component {
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => record[dataIndex]
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  handleReset = (clearFilters) => {
    clearFilters();
  };

  render() {
    const { data } = this.props;
    const myVoteRecordsCols = genMyVoteRecordsCols.call(this);

    return (
      <section className={`${clsPrefix}-section`}>
        <h2 className={`${clsPrefix}-header table-card-header`}>
          <span>My Votes</span>
          {/* <span className='node-color-intro-group'>
            <span className='node-color-intro-item'>BP节点</span>
            <span className='node-color-intro-item'>候选节点</span>
          </span> */}
          {/* <Search
            placeholder='输入节点名称'
            onSearch={value => console.log(value)}
          /> */}
        </h2>
        <Table
          columns={myVoteRecordsCols}
          dataSource={data}
          // loading={loading}
          pagination={pagination}
          rowKey={(record) => record.voteId}
          scroll={{ x: 1024 }}
        />
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.common,
});

export default connect(mapStateToProps)(MyVoteRecords);
