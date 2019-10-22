/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:53:57
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-22 19:38:13
 * @Description: the page of election and nodes's notification
 */
import React, { PureComponent } from 'react';
import { Row, Col, message } from 'antd';
import moment from 'moment';

import StatisticalData from '@components/StatisticalData/';
import getCurrentWallet from '@utils/getCurrentWallet';
import NodeTable from './NodeTable';
import ElectionRuleCard from './ElectionRuleCard/ElectionRuleCard';
import MyWalletCard from './MyWalletCard/';
import { SYMBOL } from '@src/constants';
import './ElectionNotification.style.less';

const deadline = Date.now() + 1000 * 15; // Moment is also OK

const electionNotifiStatisData = {
  termEndTime: {
    id: 0,
    title: '距本届（第-届）投票结束还有',
    isCountdown: true,
    resetTime: 1000 * 60 * 60 * 24 * 7
  },
  currentNodesAmount: {
    id: 1,
    title: '当前节点数'
  },
  currentVotesAmount: {
    id: 2,
    title: '当前总票数'
  },
  currentMiningReward: {
    id: 3,
    title: `分红池(${SYMBOL})`
  }
};

export default class ElectionNotification extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // currentWallet: null,
      contracts: null,
      showWallet: false,
      nightElf: null,

      candidates: null,
      nodesCount: null,
      showDownloadPlugin: true,
      // todo: should I place statisData in state?
      statisData: electionNotifiStatisData
    };

    this.hasRun = false;
  }

  componentDidUpdate(prevProps, prevState) {
    const { electionContract, consensusContract } = this.props;
    const { statisData } = this.state;
    // console.log('statisData', statisData);
    // todo: decouple, it's too couple here
    if (
      electionContract !== null &&
      consensusContract !== null &&
      !this.hasRun
    ) {
      // this.fetchTotalVotesAmount();
      this.hasRun = true;
      this.fetchStatisData();
    }
  }

  // fetchTotalVotesAmount() {
  //   const { electionContract } = this.props;
  // }

  processStatisData(key, param, value) {
    let { statisData } = this.state;
    statisData[key][param] = value;
    // todo: Is it required?
    statisData = { ...statisData };
    this.setState({
      statisData
    });
  }

  fetchStatisData() {
    const { electionContract, consensusContract } = this.props;
    // todo: decouple, it's too couple here

    const dataSource = {
      title: [
        {
          contract: consensusContract,
          methods: [
            {
              method: 'GetCurrentTermNumber',
              statisDataKey: 'termEndTime',
              processor: value => `距本届（第${value}届）投票结束还有`
            }
          ]
        }
      ],
      num: [
        {
          contract: electionContract,
          methods: [
            {
              method: 'GetCandidates',
              processor: value => value.length,
              statisDataKey: 'currentNodesAmount'
            },
            {
              method: 'GetVotesAmount',
              processor: value => value,
              statisDataKey: 'currentVotesAmount'
            },
            {
              method: 'GetCurrentMiningReward',
              processor: value => value,
              statisDataKey: 'currentMiningReward'
            }
            // { method: 'GetCandidates', processor: value => value.length }
          ]
        },
        {
          contract: consensusContract,
          methods: [
            {
              method: 'GetNextElectCountDown',
              processor: value => moment().add(value, 'seconds'),
              statisDataKey: 'termEndTime'
            }
          ]
        }
      ]
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(dataSource)) {
      // console.log('key', key);
      value.forEach(item => {
        item.methods.forEach(subItem => {
          // console.log('item', item);
          item.contract[subItem.method]
            .call()
            .then(res => {
              if (res === null) {
                message.error(`${subItem.method} failed.`);
                return;
              }
              // console.log(subItem.method, res);
              this.processStatisData(
                subItem.statisDataKey,
                key,
                subItem.processor(res.value)
              );
            })
            .catch(err => {
              console.error(subItem.method, err);
            });
        });
      });
    }
  }

  render() {
    const { totalVotesAmount, showDownloadPlugin, statisData } = this.state;
    const {
      consensusContract,
      multiTokenContract,
      profitContract,
      dividendContract,
      nightElf,
      isCandidate,
      handleDividendClick,
      dividends,
      electionContractFromExt,
      shouldRefreshNodeTable,
      changeVoteState,
      shouldRefreshMyWallet,
      checkExtensionLockStatus
    } = this.props;

    const { electionContract } = this.props;
    // console.log('electionNotifiStatisData', electionNotifiStatisData);

    return (
      <section className='page-container'>
        <StatisticalData data={statisData} />
        <ElectionRuleCard isCandidate={isCandidate} />
        <MyWalletCard
          multiTokenContract={multiTokenContract}
          electionContract={electionContract}
          profitContract={profitContract}
          dividendContract={dividendContract}
          handleDividendClick={handleDividendClick}
          dividends={dividends}
          electionContractFromExt={electionContractFromExt}
          shouldRefreshMyWallet={shouldRefreshMyWallet}
          changeVoteState={changeVoteState}
          checkExtensionLockStatus={checkExtensionLockStatus}
        />
        <NodeTable
          electionContract={electionContract}
          consensusContract={consensusContract}
          nightElf={nightElf}
          shouldRefreshNodeTable={shouldRefreshNodeTable}
          changeVoteState={changeVoteState}
        />
      </section>
    );
  }
}
