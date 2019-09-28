/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-17 15:40:06
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-25 14:20:38
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

import { getTeamDesc } from '@api/vote';
import { NODE_DEFAULT_NAME, FROM_WALLET } from '@src/pages/Vote/constants';
import './index.less';

const { Paragraph } = Typography;

const clsPrefix = 'team-detail';

// todo: compitable for the case where user hasn't submit the team info yet.
export default class TeamDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isBP: false,
      rank: '-',
      terms: '-',
      totalVotes: '-',
      votedRate: '-',
      producedBlocks: '-'
    };

    this.pubkey = queryString.parse(window.location.search).pubkey;
  }

  // todo: optimize the contract's storage
  componentDidMount() {
    const { consensusContract, electionContract } = this.props;

    this.fetchData();

    if (consensusContract !== null) {
      this.justifyIsBP();
    }

    if (electionContract !== null) {
      this.fetchAllCandidateInfo();
    }
  }

  componentDidUpdate(prevProps) {
    const { consensusContract, electionContract } = this.props;
    console.log('consensusContract', consensusContract);
    if (consensusContract !== prevProps.consensusContract) {
      this.justifyIsBP();
    }

    if (electionContract !== prevProps.electionContract) {
      this.fetchAllCandidateInfo();
    }
  }

  fetchData() {
    getTeamDesc(this.pubkey)
      .then(res => {
        if (res.code !== 0) {
          message.error(res.msg);
          return;
        }
        this.setState({ data: res.data });
      })
      .catch(err => message.err(err));
  }

  fetchAllCandidateInfo() {
    const { electionContract } = this.props;

    electionContract.GetPageableCandidateInformation.call({
      start: 0,
      length: 5 // give a number large enough to make sure that we get all the nodes
      // FIXME: [unstable] sometimes any number large than 5 assign to length will cost error when fetch data
    })
      .then(res => this.processAllCandidateInfo(res.value))
      .catch(err => {
        console.error(err);
      });
  }

  processAllCandidateInfo(allCandidateInfo) {
    console.log('allCandidateInfo', allCandidateInfo);
    console.log('this.pubkey', this.pubkey);

    const candidateVotesArr = allCandidateInfo
      .map(item => item.obtainedVotesAmount)
      .sort((a, b) => b - a);
    const currentCandidate = allCandidateInfo.find(
      item => item.candidateInformation.pubkey === this.pubkey
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
    const votedRate = ((100 * totalVotes) / totalVoteAmount).toFixed(2);
    const producedBlocks = currentCandidateInfo.producedBlocks;

    this.setState({
      rank,
      terms,
      totalVotes,
      votedRate,
      producedBlocks
    });

    console.log('candidateVotesArr', candidateVotesArr);
    console.log('currentCandidate', currentCandidate);
  }

  // todo: confirm the method works well
  justifyIsBP() {
    const { consensusContract } = this.props;
    const { data } = this.state;
    consensusContract.GetCurrentMinerList.call()
      .then(res => {
        console.log('GetCurrentMinerList', res);
        // To confirm justify is BP or not after get the team's pulic key
        if (!data.publicKey) {
          this.timer = setInterval(() => {
            if (data.publicKey) {
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 300);
        }
        console.log('data.publicKey', data.publicKey);
        if (res.pubkeys.indexOf(data.publicKey) !== -1) {
          console.log("I'm BP.");
          this.setState({
            isBP: true
          });
        }
      })
      .catch(err => {
        console.error('GetCurrentMinerList', err);
      });
  }

  render() {
    const {
      data,
      isBP,
      rank,
      terms,
      totalVotes,
      votedRate,
      producedBlocks
    } = this.state;

    // todo: Is it safe if the user keyin a url that is not safe?
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
                  <h5 className={`${clsPrefix}-node-name`}>
                    {data.name || NODE_DEFAULT_NAME}
                    <Tag color='#f50'>{isBP ? 'BP' : 'Candidate'}</Tag>
                  </h5>
                  <p className={`${clsPrefix}-team-info-location`}>
                    Location: {data.location}
                  </p>
                  <p className={`${clsPrefix}-team-info-address`}>
                    Node Address: <Paragraph copyable>{data.address}</Paragraph>
                  </p>
                  <Button>
                    <Link to='/vote/apply/keyin'>Edit</Link>
                  </Button>
                </div>
              </div>
            </Col>
            <Col span={6} className='card-container-right'>
              <Button
                size='large'
                type='primary'
                data-role='vote'
                data-votetype={FROM_WALLET}
                data-nodeaddress={this.pubkey}
                data-nodename={data.name || NODE_DEFAULT_NAME}
              >
                Vote
              </Button>
              <Button size='large' type='primary' data-role='redeem'>
                Redeem
              </Button>
            </Col>
          </Row>
        </section>
        <section className={`${clsPrefix}-statistic card-container`}>
          <Statistic title='Rank' value={rank} />
          <Statistic title='Terms' value={terms} />
          <Statistic title='Total Vote' value={totalVotes} />
          <Statistic title='Voted Rate' value={`${votedRate}%`} />
          <Statistic title='Produced Blocks' value={producedBlocks} />
          <Statistic title='Dividens' value='15,333' />
        </section>
        <section className={`${clsPrefix}-intro card-container`}>
          <h5 className='card-header'>Intro</h5>
          <div className='card-content'>
            {data.intro || "The team didn't fill the intro"}
          </div>
        </section>
        <section className={`${clsPrefix}-social-network card-container`}>
          <h5 className='card-header'>Social Networks</h5>
          <div className='card-content'>
            {data.socials ? (
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
