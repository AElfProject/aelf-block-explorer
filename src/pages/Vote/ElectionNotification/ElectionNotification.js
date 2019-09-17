/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:53:57
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-17 22:29:58
 * @Description: the page of election and nodes's notification
 */
import React, { PureComponent } from 'react';
import { Row, Col, message } from 'antd';

import StatisticalData from '@components/StatisticalData/';
import DownloadPlugins from '@components/DownloadPlugins/DownloadPlugins';
import { electionNotifiStatisData } from '../constants/constants';
import NodeList from './NodeList/NodeList';
import ElectionRuleCard from './ElectionRuleCard/ElectionRuleCard';
import MyWalletCard from './MyWalletCard/MyWalletCard';
import './ElectionNotification.style.less';

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
      totalVotesAmount: null,
      showDownloadPlugin: true,
      statisData: electionNotifiStatisData
    };

    this.testElectionContract = this.testElectionContract.bind(this);
    this.testVoteContract = this.testVoteContract.bind(this);
    this.testConsensusContract = this.testConsensusContract.bind(this);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { electionContract } = this.props;
  //   if (electionContract !== null) {
  //     this.fetchTotalVotesAmount();
  //   }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    const { electionContract } = this.props;
    if (nextProps.electionContract !== electionContract ) {
      this.fetchTotalVotesAmount();
    }
  }

  fetchTotalVotesAmount() {
    const { electionContract } = this.props;
    electionContract.GetVotesAmount.call()
      .then(res => {
        console.log('res', res);

        this.setState({
          totalVotesAmount: res.value
        });
      })
      .catch(err => {
        console.error('GetVotesAmount', err);
      });
  }

  testElectionContract() {
    const { electionContract } = this.props;
    const contract = electionContract;

    // View:
    console.log('==============View Start===============');

    contract.GetCandidates.call()
      .then(res => {
        console.log('GetCandidates', res);
      })
      .catch(err => {
        console.log('GetCandidates', err);
      });

    contract.GetCandidateInformation.call({
      value:
        '044958d5c48f003c771769f4a31413cd18053516615cbde502441af8452fb53441a80cc48a7f3b0f2552fd030cacbe9012ba055a3d553b70003f2e637d55fa0f23'
    })
      .then(res => {
        console.log('GetCandidateInformation', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetTermSnapshot.call({
      termNumber: 5
    })
      .then(res => {
        console.log('GetTermSnapshot', res);
      })
      .catch(err => {
        console.log('GetTermSnapshot', err);
      });

    contract.GetMinersCount.call()
      .then(res => {
        console.log('GetMinersCount', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetElectionResult.call({
      termNumber: 5
    })
      .then(res => {
        console.log('GetElectionResult', res);
      })
      .catch(err => {
        console.log('GetElectionResult', err);
      });

    contract.GetElectorVote.call({
      value:
        '04515bc4aa4bd277b520dcad092ce0177dc5ce6d7e1ae3dc9b6aa86b89eaceaf9cedf321a9105525e164948a650164d568dd21bc9640553fac89059a915fe1fabc'
    })
      .then(res => {
        console.log('GetElectorVote', res);
      })
      .catch(err => {
        console.log('GetElectorVote', err);
      });

    contract.GetElectorVoteWithRecords.call({
      value: 'd238ba4287159b1a55f01a362cbd965f433582cd49166ea0917a9820e81845df'
    })
      .then(res => {
        console.log('GetElectorVoteWithRecords', res);
      })
      .catch(err => {
        console.log('GetElectorVoteWithRecords', err);
      });

    contract.GetElectorVoteWithAllRecords.call({
      value: 'd238ba4287159b1a55f01a362cbd965f433582cd49166ea0917a9820e81845df'
    })
      .then(res => {
        console.log('GetElectorVoteWithAllRecords', res);
      })
      .catch(err => {
        console.log('GetElectorVoteWithAllRecords', err);
      });

    contract.GetCandidateVote.call({
      value:
        '044958d5c48f003c771769f4a31413cd18053516615cbde502441af8452fb53441a80cc48a7f3b0f2552fd030cacbe9012ba055a3d553b70003f2e637d55fa0f23'
    })
      .then(res => {
        console.log('GetCandidateVote===============', res);
      })
      .catch(err => {
        console.log('GetCandidateVote===============', err);
      });

    contract.GetWelfareRewardAmountSample.call({
      value: [25920000, 51840000, 77760000]
    })
      .then(res => {
        console.log('GetWelfareRewardAmountSample', res);
      })
      .catch(err => {
        console.log('GetWelfareRewardAmountSample', err);
      });

    contract.GetPageableCandidateInformation.call({
      start: 1,
      length: 2
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetVotersCount.call()
      .then(res => {
        console.log('GetVotersCount', res);
      })
      .catch(err => {
        console.log('GetVotersCount', err);
      });

    contract.GetVotesAmount.call()
      .then(res => {
        console.log('GetVotesAmount', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetCurrentMiningReward.call()
      .then(res => {
        console.log('GetCurrentMiningReward', res);
      })
      .catch(err => {
        console.log('GetCurrentMiningReward', err);
      });

    contract.GetMinerElectionVotingItemId.call()
      .then(res => {
        console.log('GetMinerElectionVotingItemId', res);
      })
      .catch(err => {
        console.log(err);
      });
    // debugger;
    contract.GetDataCenterRankingList.call()
      .then(res => {
        console.log('GetDataCenterRankingList', res);
      })
      .catch(err => {
        console.log(err);
      });
    console.log('==============View End===============');

    // Action:
    console.log('==============Action Start===============');

    const timeMS = new Date('2019-9-14').getTime();
    contract
      .Vote({
        candidate_pubkey:
          '04444be307d659ba7bbebc188cfdec9eb7b947f5a3e52c41a5e9e6a21a174017f3586ff8031555b87cfd561f54374411eeae922f5a1fb6e8a3f918b8c91e2abd7d',
        amount: 1,
        end_timestamp: {
          seconds: timeMS / 1000,
          nanos: (timeMS % 1000) * 1e6
        }
      })
      .then(res => {
        console.log('Vote', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract
      .Withdraw(
        '293cd672c14079fedd656430d1382a6940b3253931839f62eaf8bcf4cfb13064'
      )
      .then(res => {
        console.log('Withdraw', res);
      })
      .catch(err => {
        console.log(err);
      });

    console.log('==============Action End===============');
  }

  testVoteContract() {
    const { voteContract } = this.state;
    const contract = voteContract;
    contract.GetVotingItem.call({
      votingItemId:
        '06df95537a39f6230f50d41494354b5e5b2cc96ca55ca2850b60dc5a7476b0d4'
    })
      .then(res => {
        console.log('GetVotingItem', res);
      })
      .catch(err => {
        console.log('GetVotingItem', err);
      });

    contract.GetVotingResult.call({
      votingItemId:
        '06df95537a39f6230f50d41494354b5e5b2cc96ca55ca2850b60dc5a7476b0d4',
      snapshotNumber: 2
    })
      .then(res => {
        console.log('GetVotingResult', res);
      })
      .catch(err => {
        console.log('GetVotingResult', err);
      });

    contract.GetLatestVotingResult.call(
      '06df95537a39f6230f50d41494354b5e5b2cc96ca55ca2850b60dc5a7476b0d4'
    )
      .then(res => {
        console.log('GetLatestVotingResult', res);
      })
      .catch(err => {
        console.log('GetLatestVotingResult', err);
      });

    contract.GetVotingRecord.call(
      '75374311fa182a8120d1084da0edb76c843c33d8e7a4bd8b645544183731d117'
    )
      .then(res => {
        console.log('GetVotingRecord', res);
      })
      .catch(err => {
        console.log('GetVotingRecord', err);
      });

    contract.GetVotingRecords.call()
      .then(res => {
        console.log('GetVotingRecords', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetVotedItems.call(
      '2BAJEH5qsLYDFU4qv4mjfPWMzvfxHznAXxtcUKP8YtAPPM1CCv'
    )
      .then(res => {
        console.log('GetVotedItems', res);
      })
      .catch(err => {
        console.log('GetVotedItems', err);
      });

    contract.GetVotingIds.call({
      voter: '2BAJEH5qsLYDFU4qv4mjfPWMzvfxHznAXxtcUKP8YtAPPM1CCv',
      votingItemId:
        '06df95537a39f6230f50d41494354b5e5b2cc96ca55ca2850b60dc5a7476b0d4'
    })
      .then(res => {
        console.log('GetVotingIds', res);
      })
      .catch(err => {
        console.log('GetVotingIds', err);
      });
  }

  testConsensusContract() {
    const { consensusContract: contract } = this.props;
    contract.GetCurrentMinerList.call()
      .then(res => {
        console.log('GetCurrentMinerList', res);
      })
      .catch(err => {
        console.log('GetCurrentMinerList', err);
      });
  }

  processStatisData() {
    const { totalVotesAmount, statisData } = this.state;
    statisData.currentVotesAmount.num = totalVotesAmount;
    this.setState({
      statisData
    });
  }

  render() {
    const { totalVotesAmount, showDownloadPlugin, statisData } = this.state;
    const { consensusContract } = this.props;

    this.processStatisData();

    const { electionContract } = this.props;
    console.log('electionNotifiStatisData', electionNotifiStatisData);

    return (
      <section className='page-container'>
        {showDownloadPlugin ? <DownloadPlugins /> : null}
        <StatisticalData data={statisData} />
        <ElectionRuleCard />
        <MyWalletCard />
        <NodeList electionContract={electionContract} />

        <div>BP节点：</div>
        <div>候选节点：</div>
        <div>
          <button onClick={this.testElectionContract}>
            test election contract
          </button>
        </div>
        <div>
          <button onClick={this.testVoteContract}>test vote contract</button>
        </div>
        <div>
          <button onClick={this.testConsensusContract}>
            test consensus contract
          </button>
        </div>
      </section>
    );
  }
}
