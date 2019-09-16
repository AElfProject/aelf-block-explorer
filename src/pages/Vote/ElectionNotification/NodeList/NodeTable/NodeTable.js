import React, { Component } from 'react';
import { Table, message, Button } from 'antd';

import './NodeTable.style.less';

const nodeListCols = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.rank - b.rank
  },
  {
    title: 'Node Name',
    key: 'nodeName'
  },
  {
    title: 'Terms',
    dataIndex: 'terms',
    key: 'terms',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.terms - b.terms
  },
  {
    title: 'Produce Blocks',
    dataIndex: 'producedBlocks',
    key: 'producedBlocks',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.producedBlocks - b.producedBlocks
  },
  {
    title: 'Obtained Votes Count',
    dataIndex: 'obtainedVotesAmount',
    key: 'obtainedVotesCount',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.obtainedVotesAmount - b.obtainedVotesAmount
  },
  {
    title: 'Voted Rate',
    key: 'votedRate',
    dataIndex: 'votedRate',
    defaultSortOrder: 'descend',
    render: value => `${value}%`,
    sorter: (a, b) => a.votedRate - b.votedRate
  },
  {
    title: 'My Votes',
    key: 'myVotes'
  },
  {
    title: 'Operations',
    key: 'operations',
    render: (text, record) => (
      <div className='node-list-btn-group'>
        {/* todo: replace pubkey by address? */}
        <Button
          className='vote-btn'
          key={record.pubkey}
          type='primary'
          style={{ marginRight: '20px' }}
          data-nodeaddress={record.pubkey}
        >
          Vote
        </Button>
        <Button key={record.pubkey + 1} type='primary'>
          Withdraw
        </Button>
      </div>
    )
  }
];

nodeListCols.forEach(item => {
  item.align = 'center';
});

const pagination = {
  showQuickJumper: true,
  total: 0,
  showTotal: total => `Total ${total} items`
};

class NodeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: 0,
      loading: false,
      consensus: null,
      allVotes: 0,

      nodeList: [],
      totalVotesAmount: null
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.electionContract !== prevProps.electionContract) {
      // Need await to ensure the totalVotesCount take its seat.
      await this.fetchTotalVotesAmount();
      this.fetchNodes();
    }
  }

  processNodesData(nodesData) {
    const { totalVotesAmount } = this.state;

    return nodesData
      .map(item => ({
        ...item.candidateInformation,
        obtainedVotesAmount: item.obtainedVotesAmount,
        votedRate: (
          (item.obtainedVotesAmount / totalVotesAmount) *
          100
        ).toFixed(2)
      }))
      .filter(item => item.isCurrentCandidate)
      .sort((a, b) => b.obtainedVotesAmount - a.obtainedVotesAmount) // todo: is it accurate?
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        terms: item.terms.length
      }));
  }

  fetchNodes() {
    const { electionContract } = this.props;

    electionContract.GetPageableCandidateInformation.call({
      start: 1,
      length: 10
    })
      .then(res => {
        console.log('res', res);
        const processedNodesData = this.processNodesData(res.value);
        console.log('GetPageableCandidateInformation', processedNodesData);

        this.setState({
          nodeList: processedNodesData
        });
      })
      .catch(err => {
        console.log('GetPageableCandidateInformation', err);
      });
  }

  fetchTotalVotesAmount() {
    this.props.electionContract.GetVotesAmount.call().then(res => {
      console.log('totalVoteAmount', res);

      this.setState({
        totalVotesAmount: res.value
      });
    });
  }

  render() {
    // const voteInfoColumn = this.getVoteInfoColumn();
    const { nodeList, loading } = this.state;
    // const { handleTableChange } = this;
    return (
      <section className='vote-table'>
        <Table
          columns={nodeListCols}
          dataSource={nodeList}
          // onChange={handleTableChange}
          // loading={loading}
          pagination={pagination}
          rowKey={record => record.pubkey}
        />
      </section>
    );
  }
}

export default NodeTable;
