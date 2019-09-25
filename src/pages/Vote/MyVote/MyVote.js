import React, { Component } from 'react';
import moment from 'moment';

import StatisticalData from '@components/StatisticalData/';
import { myVoteStatisData } from '../constants';
import MyVoteRecord from './MyVoteRecords';
import { getAllTeamDesc } from '@api/vote';
import getCurrentWallet from '@utils/getCurrentWallet';
import { NODE_DEFAULT_NAME } from '@src/pages/Vote/constants';

export default class MyVote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statisData: myVoteStatisData,
      tableData: []
    };
  }

  componentDidMount() {
    this.fetchTableDataAndStatisData();
  }

  // componentDidUpdate(prevProps, prevState) {

  //   this.fetchTableDataAndStatisData();
  // }

  fetchTableDataAndStatisData() {
    const { electionContract } = this.props;
    const currentWallet = getCurrentWallet();

    // todo: is it ok to get the same data twice in different tabs
    // todo: add error handle
    Promise.all([
      electionContract.GetElectorVoteWithAllRecords.call({
        value: currentWallet.pubKey
      }),
      getAllTeamDesc()
    ]).then(resArr => {
      console.log('resArr', resArr);
      this.processData(resArr);
    });
  }

  processData(resArr) {
    const electorVotes = resArr[0];
    let allTeamInfo = null;
    if (resArr[1].code === 0) {
      allTeamInfo = resArr[1].data;
    }
    const myVoteRecords = [
      ...electorVotes.activeVotingRecords,
      ...electorVotes.withdrawnVotesRecords
    ];
    const myTotalVotesAmount = electorVotes.allVotedVotesAmount;
    this.processStatisData('myTotalVotesAmount', 'num', myTotalVotesAmount);
    this.processTableData(myVoteRecords, allTeamInfo);
  }

  // eslint-disable-next-line class-methods-use-this
  processTableData(myVoteRecords, allTeamInfo) {
    // add node name
    const tableData = myVoteRecords;
    tableData.forEach(record => {
      const teamInfo = allTeamInfo.find(
        team => team.public_key === record.candidate
      );
      console.log('teamInfo', teamInfo);
      if (teamInfo === undefined) {
        record.name = NODE_DEFAULT_NAME;
      } else {
        record.name = teamInfo.name;
      }
      record.operationTime = moment()
        .set('second', record.voteTimestamp.seconds)
        .format('YYYY-MM-DD');
      record.status = 'Success';
      record.type = 'Vote';
      record.lockTime = moment()
        .set('second', record.lockTime)
        .format('YYYY-MM-DD');
    });
    // todo: withdrawn's timestamp

    this.setState({
      tableData
    });
  }

  processStatisData(key, param, value) {
    let { statisData } = this.state;
    statisData[key][param] = value;
    // todo: Is it required?
    statisData = { ...statisData };
    this.setState({
      statisData
    });
  }

  // fetchStatisData(){

  // }

  render() {
    const { statisData, tableData } = this.state;

    return (
      <section className='page-container'>
        <StatisticalData data={statisData} />
        <MyVoteRecord data={tableData} />
      </section>
    );
  }
}
