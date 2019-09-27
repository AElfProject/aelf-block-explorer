import React, { Component } from 'react';
import { Spin, Input } from 'antd';

import NodeTable from './NodeTable/NodeTable';
import './NodeList.style.less';

const { Search } = Input;
const clsPrefix = 'node-list';

export default class NodeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVote: false,
      isRedeem: false,
      confirmLoading: false,
      votingAmount: null,
      myVote: null,
      txId: null,
      nodeName: null,
      publicKey: null,
      showVote: true,
      showVotingRecord: false,
      showMyVote: false,
      refresh: 0,
      isRefresh: false,
      consensus: null,
      contracts: null
    };
  }

  render() {
    const { electionContract, nightElf } = this.props;

    return (
      <section className={`${clsPrefix}`}>
        <Spin spinning={this.state.isRefresh} tip='Loading...' size='large'>
          <h2 className={`${clsPrefix}-header`}>
            <span>节点列表</span>
            {/* <span className='node-color-intro-group'>
              <span className='node-color-intro-item'>BP节点</span>
              <span className='node-color-intro-item'>候选节点</span>
            </span> */}
            <Search
              placeholder='输入节点名称'
              onSearch={value => console.log(value)}
            />
          </h2>
          <NodeTable electionContract={electionContract} nightElf={nightElf} />
        </Spin>
      </section>
    );
  }
}
