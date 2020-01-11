/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:53:57
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-09 18:36:12
 * @Description: the page of election and nodes's notification
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';
import moment from 'moment';

import StatisticalData from '@components/StatisticalData/';
import NodeTable from './NodeTable';
import ElectionRuleCard from './ElectionRuleCard/ElectionRuleCard';
import MyWalletCard from './MyWalletCard/MyWalletCard';
import {
  SYMBOL,
  ELECTION_NOTIFI_DATA_TIP,
  txStatusInUpperCase,
  UNKNOWN_ERROR_TIP,
  LONG_NOTIFI_TIME
} from '@src/constants';
import './ElectionNotification.style.less';
import CandidateApplyModal from './CandidateApplyModal/CandidateApplyModal';
import { aelf } from '@src/utils';
import getStateJudgment from '@utils/getStateJudgment';

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

class ElectionNotification extends PureComponent {
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
      statisDataLoading: false,

      applyModalVisible: false
    };

    this.hasRun = false;

    this.handleApplyModalOk = this.handleApplyModalOk.bind(this);
    this.handleApplyModalCancel = this.handleApplyModalCancel.bind(this);
    this.displayApplyModal = this.displayApplyModal.bind(this);
  }

  componentDidMount() {
    const {
      changeVoteState,
      electionContract,
      multiTokenContract,
      profitContractFromExt
    } = this.props;

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
              processor: value => isNaN(value) ? 0 : value,
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

  handleApplyModalOk() {
    const {
      currentWallet,
      electionContractFromExt,
      checkExtensionLockStatus
    } = this.props;

    // todo: there are the same code in Vote.js
    // todo: error handle
    checkExtensionLockStatus().then(() => {
      electionContractFromExt
        .AnnounceElection()
        .then(res => {
          if (res.error) {
            message.error(res.errorMessage.message);
            return;
          }
          if (!res) {
            message.error(UNKNOWN_ERROR_TIP);
            return;
          }
          const transactionId = res.result
            ? res.result.TransactionId
            : res.TransactionId;
          setTimeout(async () => {
            try {
              const result = await aelf.chain.getTxResult(transactionId);
              this.setState({
                applyModalVisible: false
              });
              const { Status: status } = result;
              getStateJudgment(status, transactionId);
              if (status === txStatusInUpperCase.mined) {
                this.props.history.push(
                    `/vote/apply/keyin?pubkey=${currentWallet &&
                    currentWallet.pubkey}`
                );
              }
            } catch (e) {
              console.log(e);
              message.error('message');
            }
          }, 4000);
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  displayApplyModal() {
    this.setState({
      applyModalVisible: true
    });
  }

  handleApplyModalCancel() {
    this.setState({
      applyModalVisible: false
    });
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
      statisDataLoading,
      applyModalVisible
    } = this.state;

    const { electionContract } = this.props;

    return (
      <section>
        <StatisticalData
          data={statisData}
          spinning={statisDataLoading}
          style={{ marginBottom: 20 }}
          tooltip={ELECTION_NOTIFI_DATA_TIP}
        />
        <div className="election-blank" />
        <ElectionRuleCard
          isCandidate={isCandidate}
          currentWallet={currentWallet}
          displayApplyModal={this.displayApplyModal}
        />
        <div className="election-blank" />
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
        <div className="election-blank" />
        <NodeTable
          electionContract={electionContract}
          consensusContract={consensusContract}
          nightElf={nightElf}
          shouldRefreshNodeTable={shouldRefreshNodeTable}
          changeVoteState={changeVoteState}
        />
        <CandidateApplyModal
          visible={applyModalVisible}
          onOk={this.handleApplyModalOk}
          onCancel={this.handleApplyModalCancel}
          currentWallet={currentWallet}
        />
      </section>
    );
  }
}

export default withRouter(ElectionNotification);
