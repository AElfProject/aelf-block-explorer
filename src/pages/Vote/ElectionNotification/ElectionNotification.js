/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:53:57
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-31 20:58:48
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
      nightElf: null
    };
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
        this.setState({
          [contractNickname]: contract
        });
        if (contractNickname === 'consensusContract') {
          this.chainInfo = contract;
          // todo: We shouldn't get vote info by consensus contract
          // this.getInformation(result);
        }
      }
    );
  }

  getExtensionKeypairList() {
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

  async componentDidMount() {
    let httpProvider = DEFAUT_RPC_SERVER;

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
      </section>
    );
  }
}
