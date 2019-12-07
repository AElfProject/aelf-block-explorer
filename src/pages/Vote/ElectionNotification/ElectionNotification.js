/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:53:57
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-11-06 13:17:38
 * @Description: the page of election and nodes's notification
 */
import React, { PureComponent } from 'react';
import { message } from 'antd';
import moment from 'moment';

import StatisticalData from '@components/StatisticalData/';
import NodeTable from './NodeTable';
import ElectionRuleCard from './ElectionRuleCard/ElectionRuleCard';
import MyWalletCard from './MyWalletCard/MyWalletCard';
import { SYMBOL, ELECTION_NOTIFI_DATA_TIP } from '@src/constants';
import './ElectionNotification.style.less';

const deadline = Date.now() + 1000 * 15; // Moment is also OK

const electionNotifiStatisData = {
  termEndTime: {
    id: 0,
    title: "Current Term's Countdown (-th term)",
    isCountdown: true,
    resetTime: 1000 * 60 * 60 * 24 * 7
  },
  currentNodesAmount: {
    id: 1,
    title: "Current Node's Amount"
  },
  currentVotesAmount: {
    id: 2,
    title: 'Current Votes Amount'
  },
  currentMiningReward: {
    id: 3,
    title: `Current Mining Reward (${SYMBOL})`
  }
};

export default class ElectionNotification extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      contracts: null,
      showWallet: false,
      nightElf: null,

      candidates: null,
      nodesCount: null,
      showDownloadPlugin: true,
      // todo: should I place statisData in state?
      statisData: electionNotifiStatisData,
      statisDataLoading: false
    };

    this.hasRun = false;
  }

  componentDidMount() {
    const {
      changeVoteState,
      electionContract,
      multiTokenContract,
      profitContractFromExt
    } = this.props;

    console.log({
      props: this.props
    });

    this.fetchData();

    if (electionContract && multiTokenContract && profitContractFromExt) {
      changeVoteState({
        shouldRefreshMyWallet: true
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.fetchData();
  }

  fetchData() {
    const {
      electionContract,
      consensusContract,
      shouldRefreshElectionNotifiStatis,
      changeVoteState
    } = this.props;
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

    if (shouldRefreshElectionNotifiStatis) {
      // Avoid repeating refresh
      changeVoteState(
        {
          shouldRefreshElectionNotifiStatis: false
        },
        () => {
          this.fetchStatisData();
        }
      );
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
    this.setState(
      {
        statisData
      },
      () => {
        // todo: put the setState where it should be
        this.setState({
          statisDataLoading: false
        });
      }
    );
  }

  fetchStatisData() {
    const { electionContract, consensusContract } = this.props;
    // todo: decouple, it's too couple here
    this.setState({
      statisDataLoading: true
    });
    const dataSource = {
      title: [
        {
          contract: consensusContract,
          methods: [
            {
              method: 'GetCurrentTermNumber',
              statisDataKey: 'termEndTime',
              processor: value => `Current Term's Countdown (${value}th term)`
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
      checkExtensionLockStatus,
      currentWallet
    } = this.props;
    const {
      totalVotesAmount,
      showDownloadPlugin,
      statisData,
      statisDataLoading
    } = this.state;

    const { electionContract } = this.props;
    // console.log('electionNotifiStatisData', electionNotifiStatisData);

    return (
      <section>
        <ElectionRuleCard
          isCandidate={isCandidate}
          currentWallet={currentWallet}
        />
        <div className='election-blank'></div>
        <StatisticalData
          data={statisData}
          spinning={statisDataLoading}
          style={{ marginBottom: 20 }}
          tooltip={ELECTION_NOTIFI_DATA_TIP}
        />
        <div className='election-blank'></div>
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
        <div className='election-blank'></div>
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
