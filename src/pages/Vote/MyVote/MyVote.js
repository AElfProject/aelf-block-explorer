import React, { Component } from 'react';

import StatisticalData from '@components/StatisticalData/';
import { myVoteStatisData } from '../constants/constants';
import MyVoteRecord from './MyVoteRecords';

export default class MyVote extends Component {
  render() {
    return (
      <section className='page-container'>
        <StatisticalData data={myVoteStatisData} />
        <MyVoteRecord></MyVoteRecord>
      </section>
    );
  }
}
