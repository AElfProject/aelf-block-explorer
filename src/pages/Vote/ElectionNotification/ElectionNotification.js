/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:53:57
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-04 21:58:55
 * @Description: the page of election and nodes's notification
 */
import React, { Component } from 'react';
import { Row, Col, message } from 'antd';

import { aelf } from '@src/utils';
import NightElfCheck from '@utils/NightElfCheck';
import getContractAddress from '@utils/getContractAddress';

import { DEFAUTRPCSERVER as DEFAUT_RPC_SERVER, APPNAME } from '@config/config';
import { contractsNeedToLoad } from '../constants/constants';

export default class ElectionNotification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // currentWallet: null,
      contracts: null,
      consensusContract: null,
      dividendContract: null,
      tokenContract: null,
      voteContract: null,
      electionContract: null,
      showDownloadPlugins: false,
      showWallet: false,
      nightElf: null,

      candidates: null
    };

    this.testElectionContract = this.testElectionContract.bind(this);
    this.testVoteContract = this.testVoteContract.bind(this);
  }

  /**
   * @description
   * @param {*} result
   * @param {*} contractNickname e.g. nickname: election, formal name: AElf.ContractNames.Election
   * @memberof ElectionNotification
   */
  getContractByContractAddress(result, contractAddrValName, contractNickname) {
    // TODO: 补充error 逻辑
    // FIXME: why can't I get the contract by contract name ? In aelf-command it works.
    aelf.chain.contractAt(
      result[contractAddrValName],
      result.wallet,
      (error, contract) => {
        console.log(contractNickname, contract);
        this.setState(
          {
            [contractNickname]: contract
          },
          () => {
            if (contractNickname === 'electionContract') {
              this.getNodesInfo();
            }
          }
        );
        if (contractNickname === 'consensusContract') {
          this.chainInfo = contract;
          // todo: We shouldn't get vote info by consensus contract
          // this.getInformation(result);
        }
      }
    );
  }

  getExtensionKeypairList() {
    let httpProvider = DEFAUT_RPC_SERVER;

    NightElfCheck.getInstance()
      .check.then(item => {
        if (item) {
          nightElf = new window.NightElf.AElf({
            httpProvider: [
              httpProvider,
              null,
              null,
              null,
              [
                {
                  name: 'Accept',
                  value: 'text/plain;v=1.0'
                }
              ]
            ],
            appName // TODO: 这个需要content.js 主动获取
          });
          if (nightElf) {
            this.setState({
              nightElf
            });
            nightElf.chain.getChainStatus((error, result) => {
              if (result) {
                nightElf.checkPermission(
                  {
                    appName,
                    type: 'domain'
                  },
                  (error, result) => {
                    if (result) {
                      this.insertKeypairs(result);
                    }
                  }
                );
              }
            });
          }
        }
      })
      .catch(error => {
        this.setState({
          showDownloadPlugins: true
        });
      });
  }

  getNodesInfo() {
    const { electionContract } = this.state;
    electionContract.GetCandidates.call((error, result) => {
      console.log('result', result);
    });
  }

  testElectionContract() {
    const { electionContract } = this.state;
    const contract = electionContract;

    contract.GetWelfareRewardAmountSample.call({
      value: [25920000, 51840000, 77760000]
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
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

    contract.GetVotesAmount.call()
      .then(res => {
        console.log('GetVotesAmount', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetMinerElectionVotingItemId.call()
      .then(res => {
        console.log('GetMinerElectionVotingItemId', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetDataCenterRankingList.call()
      .then(res => {
        console.log('GetDataCenterRankingList', res);
      })
      .catch(err => {
        console.log(err);
      });

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
  }

  testVoteContract() {
    const { voteContract } = this.state;
    const contract = voteContract;
    contract.GetVotingItem.call(
      '06df95537a39f6230f50d41494354b5e5b2cc96ca55ca2850b60dc5a7476b0d4'
    )
      .then(res => {
        console.log('GetVotingItem', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract
      .GetVotingResult(1, 0)
      .then(res => {
        console.log('GetVotingResult', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetLatestVotingResult.call()
      .then(res => {
        console.log('GetLatestVotingResult', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetVotingRecord.call()
      .then(res => {
        console.log('GetVotingRecord', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetVotingRecords.call()
      .then(res => {
        console.log('GetVotingRecords', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetVotedItems.call()
      .then(res => {
        console.log('GetVotedItems', res);
      })
      .catch(err => {
        console.log(err);
      });

    contract.GetVotingIds.call()
      .then(res => {
        console.log('GetVotingIds', res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async componentDidMount() {
    // Get contracts
    try {
      const result = await getContractAddress();
      this.setState({
        contracts: result
      });
      if (!result.chainInfo) {
        message.error(
          'The chain has stopped or cannot be connected to the chain. Please check your network or contact us.',
          10
        );
        return;
      }
      contractsNeedToLoad.forEach(contractItem => {
        this.getContractByContractAddress(
          result,
          contractItem.contractAddrValName,
          contractItem.contractNickname
        );
      });
    } catch (e) {
      message.error(e);
    }

    this.getExtensionKeypairList();
  }

  render() {
    return (
      <section>
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
      </section>
    );
  }
}
