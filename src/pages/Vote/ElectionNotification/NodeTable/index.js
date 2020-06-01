/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-12-07 17:42:20
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-10 01:58:14
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  message,
  Button,
  Input,
  Icon,
  Spin,
  Progress,
  Tooltip
} from 'antd';
import moment from 'moment';
// import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';

import {
  getAllTeamDesc,
  fetchPageableCandidateInformation,
  fetchElectorVoteWithRecords
} from '@api/vote';
import { fetchCurrentMinerPubkeyList } from '@api/consensus';
import getCurrentWallet from '@utils/getCurrentWallet';
import publicKeyToAddress from '@utils/publicKeyToAddress';
import { centerEllipsis } from '@utils/formater';
import {
  NODE_DEFAULT_NAME,
  FROM_WALLET,
  A_NUMBER_LARGE_ENOUGH_TO_GET_ALL
} from '@src/pages/Vote/constants';
import { ADDRESS_INFO } from '@config/config';
import './index.less';
import NightElfCheck from "../../../../utils/NightElfCheck";
import getLogin from "../../../../utils/getLogin";
import {ELF_DECIMAL} from "../../constants";
import {getPublicKeyFromObject} from "../../../../utils/getPublicKey";

const { Search } = Input;
const clsPrefix = 'node-table';

const pagination = {
  showQuickJumper: true,
  total: 0,
  showTotal: total => `Total ${total} items`,
  pageSize: 20
};

class NodeTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nodeList: [],
      currentWallet: {},
      totalVotesAmount: null,
      // searchText: '',
      isLoading: false
    };

    this.hasRun = false;
  }

  // todo: how to combine cdm & cdu
  componentDidMount() {
    this.getCurrentWallet();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('getCurrentWallet prevProps prevState: ', prevProps, prevState);
    if (!prevProps.electionContract && this.props.electionContract) {
      this.getCurrentWallet();
    }
    if ((!prevProps.electionContract || !prevProps.consensusContract)
      && (this.props.electionContract && this.props.consensusContract)) {
      this.fetchNodes({});
    }
  }

  getCurrentWallet() {
    if (this.isPhone) {
      // message.info('View more on PC');
      this.setState({
        currentWallet: null
      });
      return null;
    }

    NightElfCheck.getInstance().check.then(ready => {
      const nightElf = NightElfCheck.getAelfInstanceByExtension();
      getLogin(nightElf, {}, result => {
        if (result.error) {
          // message.warn(result.message || result.errorMessage.message);
        } else {
          const wallet =  JSON.parse(result.detail);
          const currentWallet = {
            formattedAddress:  `${ADDRESS_INFO.PREFIX}_${wallet.address}_${ADDRESS_INFO.CURRENT_CHAIN_ID}`,
              address: wallet.address,
              name: wallet.name,
              pubKey: getPublicKeyFromObject(wallet.publicKey)
          }
          this.setState({
            currentWallet
          });
          // console.log('getCurrentWallet currentWallet: ', currentWallet);
          this.fetchData(currentWallet);
        }
      }, false);
    }).catch(error => {
      // console.log('getCurrentWallet.getInsta', error);
      // message.warn('Please download and install NightELF browser extension.');
    });
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
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
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    }
    // render: text => (
    //   <Highlighter
    //     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //     searchWords={[this.state.searchText]}
    //     autoEscape
    //     textToHighlight={text.toString()}
    //   />
    // )
  });

  getCols() {
    const { isSmallScreen } = this.props;

    const nodeListCols = [
      {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        width: 70,
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.rank - b.rank
      },
      {
        title: 'Node Name',
        dataIndex: 'name',
        key: 'nodeName',
        width: 200,
        ellipsis: true,
        // todo: ellipsis useless
        // ellipsis: true,
        render: (text, record) => (
          <Tooltip title={text}>
            <Link
              to={{ pathname: '/vote/team', search: `pubkey=${record.pubkey}` }}
            >
              {text}
            </Link>
          </Tooltip>
        ),
        ...this.getColumnSearchProps('name')
      },
      {
        title: 'Node Type',
        dataIndex: 'nodeType',
        width: 90,
        key: 'nodeType'
        // todo: write the sorter after the api is ready
        // sorter: (a, b) => a.nodeType - b.nodeType
      },
      {
        title: 'Terms',
        dataIndex: 'terms',
        width: 90,
        key: 'terms',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.terms - b.terms
      },
      {
        title: 'Produce Blocks',
        dataIndex: 'producedBlocks',
        width: 150,
        key: 'producedBlocks',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.producedBlocks - b.producedBlocks
      },
      {
        title: 'Obtain Votes',
        dataIndex: 'obtainedVotesAmount',
        key: 'obtainedVotesCount',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.obtainedVotesAmount - b.obtainedVotesAmount,
        render: value => value / ELF_DECIMAL
      },
      {
        title: 'Voted Rate',
        key: 'votedRate',
        dataIndex: 'votedRate',
        defaultSortOrder: 'descend',
        render: value =>
          // <Progress percent={value} status="active" strokeColor="#fff" />
          `${value}%`,
        sorter: (a, b) => a.votedRate - b.votedRate
      },
      {
        title: 'My Votes',
        key: 'myVotes',
        width: 100,
        dataIndex: 'myTotalVoteAmount',
        sorter: (a, b) => a.myTotalVoteAmount - b.myTotalVoteAmount,
        render: value => (value && value !== '-') ? value / ELF_DECIMAL : '-'
      },
      {
        title: 'Operations',
        key: 'operations',
        width: 210,
        render: (text, record) => (
          <div className={`${clsPrefix}-btn-group`}>
            {/* todo: replace pubkey by address? */}
            <Button
              className="table-btn vote-btn"
              key={record.pubkey}
              type="primary"
              style={{ marginRight: 14 }}
              data-nodeaddress={record.formattedAddress}
              data-targetPublicKey={record.pubkey}
              data-role="vote"
              data-nodename={record.name}
              data-shoulddetectlock
              data-votetype={FROM_WALLET}
            >
              Vote
            </Button>
            <Button
              className="table-btn redeem-btn"
              key={record.pubkey + 1}
              type="primary"
              data-role="redeem"
              data-shoulddetectlock
              data-nodeaddress={record.formattedAddress}
              data-targetPublicKey={record.pubkey}
              data-nodename={record.name}
              disabled={
                record.myRedeemableVoteAmountForOneCandidate > 0 ? false : true
              }
            >
              Redeem
            </Button>
          </div>
        )
      }
    ];

    // todo: Realize it using css
    // Hide operations on mobile
    if (isSmallScreen) {
      nodeListCols.pop();
    }

    nodeListCols.forEach(item => {
      item.align = 'center';
    });

    return nodeListCols;
  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    // this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    // this.setState({ searchText: '' });
  };

  fetchData(currentWallet) {
    const {
      electionContract,
      consensusContract,
      shouldRefreshNodeTable,
      changeVoteState
    } = this.props;
    // todo: It seems to has useless render in cdm
    console.log({
      flag: !this.hasRun || shouldRefreshNodeTable,
      shouldRefreshNodeTable
    });
    if (
      electionContract &&
      consensusContract &&
      (!this.hasRun || shouldRefreshNodeTable)
    ) {
      changeVoteState(
        {
          shouldRefreshNodeTable: false
        },
        async () => {
          this.setState({
            isLoading: true
          });
          // Need await to ensure the totalVotesCount take its seat.
          // todo: fetchTheTotalVotesAmount after contract changed
          // await this.fetchTotalVotesAmount();
          this.fetchNodes(currentWallet);
        }
      );
      this.hasRun = true;
    }
  }

  // todo: the comment as follows maybe wrong, the data needs to share is the user's vote records
  // todo: consider to move the method to Vote comonent, because that also NodeTable and Redeem Modal needs the data;
  fetchNodes(currentWalletInput) {
    const { electionContract, consensusContract } = this.props;
    const currentWallet = currentWalletInput || this.state.currentWallet;

    Promise.all([
      fetchPageableCandidateInformation(electionContract, {
        start: 0,
        length: A_NUMBER_LARGE_ENOUGH_TO_GET_ALL // give a number large enough to make sure that we get all the nodes
      }),
      getAllTeamDesc(),
      currentWallet.pubKey
        ? fetchElectorVoteWithRecords(electionContract, {
            value: currentWallet.pubKey
          })
        : null,
      fetchCurrentMinerPubkeyList(consensusContract)
    ])
      .then(resArr => {
        // process data
        const processedNodesData = this.processNodesData(resArr);
        this.setState(
          {
            nodeList: processedNodesData
          },
          () => {
            this.setState({
              isLoading: false
            });
          }
        );
        console.log('GetPageableCandidateInformation', {
          processedNodesData,
          resArr
        });
      })
      .catch(err => {
        console.error('GetPageableCandidateInformation', err);
      });
  }

  // eslint-disable-next-line class-methods-use-this
  processNodesData(resArr) {
    // const { totalVotesAmount } = this.state;

    let totalActiveVotesAmount = 0;
    const nodeInfos = resArr[0] ? resArr[0].value : [];
    const { activeVotingRecords } = resArr[2] || {};
    let teamInfos = null;
    if (resArr[1].code === 0) {
      teamInfos = resArr[1].data;
    }
    const BPNodes = resArr[3].pubkeys;
    // add node name, add my vote amount
    nodeInfos.forEach(item => {
      // compute totalActiveVotesAmount
      // FIXME: It will result in some problem when getPageable can only get 20 nodes info at most in one time
      totalActiveVotesAmount += +item.obtainedVotesAmount;
      // add node name
      const teamInfo = teamInfos.find(
        team => team.public_key === item.candidateInformation.pubkey
      );
      console.log('teamInfo', teamInfo);
      // get address from pubkey
      item.candidateInformation.address = publicKeyToAddress(
        item.candidateInformation.pubkey
      );
      item.candidateInformation.formattedAddress = `${ADDRESS_INFO.PREFIX}_${item.candidateInformation.address}_${ADDRESS_INFO.CURRENT_CHAIN_ID}`;
      if (teamInfo === undefined) {
        // todo: use address instead after api modified
        item.candidateInformation.name = item.candidateInformation.formattedAddress;
      } else {
        item.candidateInformation.name = teamInfo.name;
      }

      // judge node type
      if (BPNodes.indexOf(item.candidateInformation.pubkey) !== -1) {
        item.candidateInformation.nodeType = 'BP';
      } else {
        item.candidateInformation.nodeType = 'Candidate';
      }

      // add my vote amount
      if (!activeVotingRecords) {
        item.candidateInformation.myTotalVoteAmount = '-';
        item.candidateInformation.myRedeemableVoteAmountForOneCandidate = '-';
        return;
      }
      // todo: use the method filterUserVoteRecordsForOneCandidate in voteUtil instead
      const myVoteRecordsForOneCandidate = activeVotingRecords.filter(
        votingRecord =>
          votingRecord.candidate === item.candidateInformation.pubkey
      );
      const myTotalVoteAmount = myVoteRecordsForOneCandidate.reduce(
        (total, current) => {
          return total + +current.amount;
        },
        0
      );
      // todo: use the method computeUserRedeemableVoteAmountForOneCandidate in voteUtil instead
      const myRedeemableVoteAmountForOneCandidate = myVoteRecordsForOneCandidate
        .filter(record => record.unlockTimestamp.seconds <= moment().unix())
        .reduce((total, current) => {
          return total + +current.amount;
        }, 0);

      item.candidateInformation.myTotalVoteAmount = myTotalVoteAmount || '-';
      item.candidateInformation.myRedeemableVoteAmountForOneCandidate =
        myRedeemableVoteAmountForOneCandidate || '-';
    });

    return nodeInfos
      .map(item => {
        const votedRate =
          totalActiveVotesAmount === 0
            ? 0
            : (
                (item.obtainedVotesAmount / totalActiveVotesAmount) *
                100
              ).toFixed(2);
        return {
          ...item.candidateInformation,
          obtainedVotesAmount: item.obtainedVotesAmount,
          votedRate
        };
      })
      .filter(item => item.isCurrentCandidate)
      .sort((a, b) => b.obtainedVotesAmount - a.obtainedVotesAmount) // todo: is it accurate?
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        terms: item.terms.length
      }));
  }

  fetchTotalVotesAmount() {
    const { electionContract } = this.props;

    electionContract.GetVotesAmount.call()
      .then(res => {
        if (res === null) {
          this.setState({
            totalVotesAmount: 0
          });
          return;
        }
        this.setState({
          totalVotesAmount: res.value
        });
      })
      .catch(err => {
        console.error('GetVotesAmount', err);
      });
  }

  render() {
    const { nodeList, isLoading } = this.state;
    const nodeListCols = this.getCols();

    return (
      <section className={`${clsPrefix}`}>
        <h2 className={`${clsPrefix}-header table-card-header`}>
          Node Table
          {/* <span className='node-color-intro-group'>
              <span className='node-color-intro-item'>BP节点</span>
              <span className='node-color-intro-item'>候选节点</span>
            </span> */}
          {/* <Search
              placeholder='输入节点名称'
              onSearch={value => console.log(value)}
            /> */}
          {/* <Button
            type='primary'
            onClick={() => {
              this.props.changeVoteState({
                shouldRefreshNodeTable: true
              });
            }}
          >
            Refresh
          </Button> */}
        </h2>
        <Table
          className="node-table-wrapper"
          columns={nodeListCols}
          dataSource={nodeList}
          // onChange={handleTableChange}
          loading={isLoading}
          pagination={pagination}
          rowKey={record => record.pubkey}
          scroll={{ x: 1024 }}
          // size='middle'
        />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  ...state.common
});

export default connect(mapStateToProps)(NodeTable);
