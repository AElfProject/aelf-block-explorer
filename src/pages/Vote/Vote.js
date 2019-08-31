/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:47:40
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-31 19:03:46
 * @Description: pages for vote & election
 */
import React, { Component } from 'react';
import ElectionNotification from './ElectionNotification/ElectionNotification';

class VoteContainer extends Component {
  render() {
    return (
      <section>
        <ElectionNotification />
      </section>
    );
  }
}

export default VoteContainer;
