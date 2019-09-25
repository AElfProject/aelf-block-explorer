import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Table, message, Button } from 'antd';
import { getAllTeamDesc } from '@api/vote';
import getCurrentWallet from '@utils/getCurrentWallet';
import { NODE_DEFAULT_NAME, FROM_WALLET } from '@src/pages/Vote/constants';

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
    dataIndex: 'name',
    key: 'nodeName',
    render: (text, record) => (
      <Link to={{ pathname: '/vote/team', search: `pubkey=${record.pubkey}` }}>
        {text}
      </Link>
    )
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
    key: 'myVotes',
    dataIndex: 'myTotalVoteAmount'
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
          data-role='vote'
          data-nodename={record.name}
          data-shouldDetectLock={true}
          data-votetype={FROM_WALLET}
        >
          Vote
        </Button>
        <Button
          key={record.pubkey + 1}
          type='primary'
          data-role='redeem'
          data-shouldDetectLock={true}
        >
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
  showTotal: total => `Total ${total} items`,
  pageSize: 3
};

class NodeTable extends PureComponent {
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

  // todo: how to combine cdm & cdu
  async componentDidMount() {
    const { electionContract } = this.props;

    if (electionContract !== null) {
      // Need await to ensure the totalVotesCount take its seat.
      await this.fetchTotalVotesAmount();
      this.fetchNodes();
    }
  }

  async componentDidUpdate(prevProps) {
    const { electionContract } = this.props;

    if (electionContract !== prevProps.electionContract) {
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
    console.log('InTable', electionContract);
    const currentWallet = getCurrentWallet();

    Promise.all([
      electionContract.GetPageableCandidateInformation.call({
        start: 0,
        length: 5 // give a number large enough to make sure that we get all the nodes
        // FIXME: [unstable] sometimes any number large than 5 assign to length will cost error when fetch data
      }),
      getAllTeamDesc(),
      electionContract.GetElectorVoteWithRecords.call({
        value: currentWallet.pubKey
      })
    ])
      .then(resArr => {
        console.log('resArr', resArr);
        // todo: error handle
        const nodeInfos = resArr[0].value;
        const activeVotingRecords = resArr[2].activeVotingRecords;
        let teamInfos = null;
        if (resArr[1].code === 0) {
          teamInfos = resArr[1].data;
        }
        // add node name, add my vote amount
        nodeInfos.forEach(item => {
          // add node name
          const teamInfo = teamInfos.find(
            team => team.public_key === item.candidateInformation.pubkey
          );
          console.log('teamInfo', teamInfo);
          if (teamInfo === undefined) {
            item.candidateInformation.name = NODE_DEFAULT_NAME;
          } else {
            item.candidateInformation.name = teamInfo.name;
          }

          // add my vote amount
          const myVoteRecords = activeVotingRecords.filter(
            votingRecord =>
              votingRecord.candidate === item.candidateInformation.pubkey
          );
          const myTotalVoteAmount = myVoteRecords.reduce((total, current) => {
            return total + +current.amount;
          }, 0);
          console.log('myTotalVoteAmount', myTotalVoteAmount || '-');
          item.candidateInformation.myTotalVoteAmount =
            myTotalVoteAmount || '-';
        });

        // process data
        const processedNodesData = this.processNodesData(nodeInfos);
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
      if (res === null) {
        message.error('Get total vote amount failed.');
        return;
      }

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
