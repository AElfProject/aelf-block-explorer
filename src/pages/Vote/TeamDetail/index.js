/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-17 15:40:06
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-11-01 11:14:35
 * @Description: file content
 */

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import {
  Statistic,
  Row,
  Col,
  Button,
  Avatar,
  Tag,
  Typography,
  message
} from 'antd';
import queryString from 'query-string';

import StatisticalData from '@components/StatisticalData/';
import { getTeamDesc, fetchElectorVoteWithRecords } from '@api/vote';
import { fetchCurrentMinerPubkeyList } from '@api/consensus';
import {
  NODE_DEFAULT_NAME,
  FROM_WALLET,
  A_NUMBER_LARGE_ENOUGH_TO_GET_ALL
} from '@src/pages/Vote/constants';
import publicKeyToAddress from '@utils/publicKeyToAddress';
import getCurrentWallet from '@utils/getCurrentWallet';
import {
  filterUserVoteRecordsForOneCandidate,
  computeUserRedeemableVoteAmountForOneCandidate
} from '@utils/voteUtils';
import './index.less';

const { Paragraph } = Typography;

const clsPrefix = 'team-detail';

// todo: compitable for the case where user hasn't submit the team info yet.
export default class TeamDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      candidateAddress: '',
      isBP: false,
      rank: '-',
      terms: '-',
      totalVotes: '-',
      votedRate: '-',
      producedBlocks: '-',
      userRedeemableVoteAmountForOneCandidate: 0,
      hasAuth: false
    };

    this.teamPubkey = queryString.parse(window.location.search).pubkey;
  }

  // todo: optimize the contract's storage
  componentDidMount() {
    const { consensusContract, electionContract, currentWallet } = this.props;

    this.fetchData();

    if (consensusContract) {
      this.justifyIsBP();
    }

    if (electionContract !== null) {
      this.fetchDataFromElectionContract();
    }

    if (currentWallet) {
      this.setState({
        hasAuth: currentWallet.pubkey === this.teamPubkey
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { consensusContract, electionContract, currentWallet } = this.props;

    if (consensusContract !== prevProps.consensusContract) {
      this.justifyIsBP();
    }

    if (electionContract !== prevProps.electionContract) {
      this.fetchDataFromElectionContract();
    }

    if (prevProps.currentWallet !== currentWallet) {
      this.setState(
        {
          hasAuth: currentWallet.pubkey === this.teamPubkey
        },
        this.fetchCandidateInfo
      );
    }
  }

  fetchData() {
    getTeamDesc(this.teamPubkey)
      .then(res => {
        if (res.code !== 0) {
          return;
        }
        this.setState({ data: res.data });
      })
      .catch(err => message.err(err));
  }

  fetchDataFromElectionContract() {
    this.fetchAllCandidateInfo();
    this.fetchTheUsersActiveVoteRecords();
  }

  fetchAllCandidateInfo() {
    const { electionContract } = this.props;

    electionContract.GetPageableCandidateInformation.call({
      start: 0,
      length: A_NUMBER_LARGE_ENOUGH_TO_GET_ALL // give a number large enough to make sure that we get all the nodes
      // FIXME: [unstable] sometimes any number large than 5 assign to length will cost error when fetch data
    })
      .then(res => this.processAllCandidateInfo(res.value))
      .catch(err => {
        console.error(err);
      });
  }

  processAllCandidateInfo(allCandidateInfo) {
    console.log('allCandidateInfo', allCandidateInfo);
    console.log('this.teamPubkey', this.teamPubkey);

    const candidateVotesArr = allCandidateInfo
      .map(item => item.obtainedVotesAmount)
      .sort((a, b) => b - a);
    const currentCandidate = allCandidateInfo.find(
      item => item.candidateInformation.pubkey === this.teamPubkey
    );

    const totalVoteAmount = candidateVotesArr.reduce(
      (total, current) => total + +current,
      0
    );
    const currentCandidateInfo = currentCandidate.candidateInformation;

    const rank =
      +candidateVotesArr.indexOf(currentCandidate.obtainedVotesAmount) + 1;
    const terms = currentCandidateInfo.terms.length;
    const totalVotes = currentCandidate.obtainedVotesAmount;
    const votedRate =
      totalVoteAmount === 0
        ? 0
        : ((100 * totalVotes) / totalVoteAmount).toFixed(2);
    const { producedBlocks } = currentCandidateInfo;

    const candidateAddress = publicKeyToAddress(this.teamPubkey);

    this.setState({
      rank,
      terms,
      totalVotes,
      votedRate,
      producedBlocks,
      candidateAddress
    });

    console.log('candidateVotesArr', candidateVotesArr);
    console.log('currentCandidate', currentCandidate);
  }

  fetchTheUsersActiveVoteRecords() {
    const { electionContract } = this.props;
    // todo: Will it break the data consistency?
    const currentWallet = getCurrentWallet();

    fetchElectorVoteWithRecords(electionContract, {
      value: currentWallet.pubKey
    })
      .then(res => {
        this.computeUserRedeemableVoteAmountForOneCandidate(
          res.activeVotingRecords
        );
      })
      .catch(err => {
        console.error('fetchElectorVoteWithRecords', err);
      });
  }

  computeUserRedeemableVoteAmountForOneCandidate(usersActiveVotingRecords) {
    const userVoteRecordsForOneCandidate = filterUserVoteRecordsForOneCandidate(
      usersActiveVotingRecords,
      this.teamPubkey
    );
    const userRedeemableVoteAmountForOneCandidate = computeUserRedeemableVoteAmountForOneCandidate(
      userVoteRecordsForOneCandidate
    );
    this.setState({
      userRedeemableVoteAmountForOneCandidate
    });
  }

  // todo: confirm the method works well
  justifyIsBP() {
    const { consensusContract } = this.props;

    fetchCurrentMinerPubkeyList(consensusContract)
      .then(res => {
        if (res.pubkeys.indexOf(this.teamPubkey) !== -1) {
          this.setState({
            isBP: true
          });
        }
      })
      .catch(err => {
        console.error('fetchCurrentMinerPubkeyList', err);
      });
  }

  getStatisData() {
    const { rank, terms, totalVotes, votedRate, producedBlocks } = this.state;

    // todo: Consider to modify the data structure with easier one
    const statisData = {
      rank: {
        title: 'Rank',
        num: rank
      },
      terms: {
        title: 'Terms',
        num: terms
      },
      totalVotes: {
        title: 'Total Vote',
        num: totalVotes
      },
      votedRate: {
        title: 'Voted Rate',
        num: `${votedRate}%`
      },
      producedBlocks: {
        title: 'Produced Blocks',
        num: producedBlocks
      }
    };
    return statisData;
  }

  render() {
    const {
      data,
      candidateAddress,
      isBP,
      userRedeemableVoteAmountForOneCandidate,
      hasAuth
    } = this.state;

    // todo: The component StatisData is PureComponent so I have to create a new heap space to place the object
    // todo: Consider to make the component StatisData non-PureComponent
    const statisData = { ...this.getStatisData() };

    // todo: Is it safe if the user keyin a url that is not safe?
    // todo: handle the error case of node-name
    // FIXME: hide the edit button for the non-owner
    return (
      <section className={`${clsPrefix} page-container`}>
        <section className={`${clsPrefix}-header card-container`}>
          <Row>
            <Col span={18} className='card-container-left'>
              <div className={`${clsPrefix}-team-avatar-info`}>
                {data.avatar ? (
                  <Avatar shape='square' size={100} src={data.avatar} />
                ) : (
                  <Avatar shape='square' size={100} icon='user' />
                )}
                <div className={`${clsPrefix}-team-info`}>
                  <h5 className={`${clsPrefix}-node-name ellipsis`}>
                    {data.name ? data.name : candidateAddress}
                    <Tag color='#f50'>{isBP ? 'BP' : 'Candidate'}</Tag>
                  </h5>
                  <p className={`${clsPrefix}-team-info-location`}>
                    Location: {data.location}
                  </p>
                  <p className={`${clsPrefix}-team-info-address`}>
                    Node Address:{' '}
                    <Paragraph copyable className='ellipsis'>
                      {candidateAddress}
                    </Paragraph>
                  </p>
                  {hasAuth ? (
                    <Button>
                      <Link
                        to={{
                          pathname: '/vote/apply/keyin',
                          search: `pubkey=${this.teamPubkey}`
                        }}
                      >
                        Edit
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </Col>
            <Col span={6} className='card-container-right'>
              <Button
                className='table-btn vote-btn'
                size='large'
                type='primary'
                data-role='vote'
                data-shoulddetectlock
                data-votetype={FROM_WALLET}
                data-nodeaddress={candidateAddress}
                data-nodename={data.name || candidateAddress}
                data-targetPublicKey={this.teamPubkey}
              >
                Vote
              </Button>
              <Button
                className='table-btn redeem-btn'
                size='large'
                type='primary'
                data-role='redeem'
                data-shoulddetectlock
                data-nodeaddress={candidateAddress}
                data-targetPublicKey={this.teamPubkey}
                data-nodename={data.name}
                disabled={
                  userRedeemableVoteAmountForOneCandidate > 0 ? false : true
                }
              >
                Redeem
              </Button>
            </Col>
          </Row>
        </section>
        <StatisticalData data={statisData} inline></StatisticalData>
        <section className={`${clsPrefix}-intro card-container`}>
          <h5 className='card-header'>Intro</h5>
          <div className='card-content'>
            {data.intro || "The team didn't fill the intro."}
          </div>
        </section>
        <section className={`${clsPrefix}-social-network card-container`}>
          <h5 className='card-header'>Social Networks</h5>
          <div className='card-content'>
            {data.socials && data.socials.length ? (
              <ul>
                {data.socials.map(item => (
                  <li>
                    {item.type}:<a href={item.url}>{item.url}</a>
                  </li>
                ))}
              </ul>
            ) : (
              "The team didn't fill the social contacts."
            )}
          </div>
        </section>
      </section>
    );
  }
}
