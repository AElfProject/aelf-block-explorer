/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:47:40
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-28 15:37:52
 * @Description: pages for vote & election
 */
import React, { Component } from 'react';
import { Tabs, Modal, Form, Input, Button, Radio, message } from 'antd';
import { Switch, Route, Link, withRouter, Redirect } from 'react-router-dom';
import { toJS, reaction } from 'mobx';
import { Provider } from 'mobx-react';
import moment from 'moment';

import './index.less';
import NightElfCheck from '@utils/NightElfCheck';
import checkPermissionRepeat from '@utils/checkPermissionRepeat';
import getLogin from '@utils/getLogin';
import { thousandsCommaWithDecimal } from '@utils/formater';
import getContractAddress from '@utils/getContractAddress';
import DownloadPlugins from '@components/DownloadPlugins/DownloadPlugins';
// import NumericInput from '@components/NumericInput';
import config, {
  DEFAUTRPCSERVER as DEFAUT_RPC_SERVER,
  APPNAME,
  profitContractAddr
} from '@config/config';
import { aelf } from '@src/utils';
// import voteStore from '@store/vote';
import contractsStore from '@store/contracts';
import { SYMBOL, ELF_DECIMAL, NEED_PLUGIN_AUTHORIZE_TIP } from '@src/constants';
import getStateJudgment from '@utils/getStateJudgment';
import MyVote from './MyVote/MyVote';
import ElectionNotification from './ElectionNotification/ElectionNotification';
import CandidateApply from './CandidateApply';
import KeyInTeamInfo from './KeyInTeamInfo';
import TeamDetail from './TeamDetail';
import VoteModal from './VoteModal';
import DividendModal from './DividendModal';
import RedeemModal from './RedeemModal';
import RedeemAnVoteModal from './RedeemAnVoteModal';
// todo: use a import instead
import * as constants from './constants';
import { contractsNeedToLoad, schemeIds } from './constants';
import { electionContractAddr } from '@config/config';
import getCurrentWallet from '@utils/getCurrentWallet';
import publicKeyToAddress from '@utils/publicKeyToAddress';
import { getAllTeamDesc } from '@api/vote';
import {
  FROM_WALLET,
  FROM_EXPIRED_VOTES,
  FROM_ACTIVE_VOTES,
  NODE_DEFAULT_NAME,
  routePaths
} from '@src/pages/Vote/constants';
import { getFormatedLockTime } from '@pages/Vote/utils';

const { TabPane } = Tabs;
const { Search } = Input;

const voteConfirmFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

// todo: optimize all the generate function
function generateVoteConfirmForm({
  currentWalletName,
  currentWalletBalance,
  need
}) {
  const res = { formItems: [] };
  const {
    nodeAddress,
    nodeName,
    voteAmountInput,
    voteFromExpiredVoteAmount,
    switchVoteAmount,
    lockTime
  } = this.state;

  const materials = {
    // title: '从未过期投票转投',
    formItems: [
      {
        type: 'nodeName',
        label: '所选节点名称',
        render: <span className='form-item-value'>{nodeName}</span>
      },
      {
        type: 'nodeAddress',
        label: '地址',
        render: <span className='form-item-value'>{nodeAddress}</span>
      },
      {
        label: '可用票数',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {123} {SYMBOL}
          </span>
        )
      },
      {
        label: '投票时间',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {123} {SYMBOL}
          </span>
        )
      },
      {
        type: 'voteAmount',
        label: '投票数量',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {voteAmountInput} {SYMBOL}
          </span>
        )
      },
      {
        type: 'lockTime',
        label: '锁定期',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {lockTime && lockTime.format('YYYY-MM-DD HH:mm:ss')}{' '}
            <span className='tip-color'>锁定期内不支持提币和转账</span>
          </span>
        )
      },
      {
        label: '转投数量',
        type: 'switchVoteAmount',
        // render: (
        //   <div>
        //     <Input
        //       suffix={SYMBOL}
        //       placeholder='Enter vote amount'
        //       style={{ marginRight: 20 }}
        //     />
        //     <Button type='primary'>All In</Button>
        //   </div>
        // )
        render: (
          <span className='form-item-value'>
            {switchVoteAmount} {SYMBOL}
          </span>
        )
      },
      {
        label: '转投数量',
        type: 'voteFromExpiredVoteAmount',
        // render: (
        //   <div>
        //     <Input
        //       suffix={SYMBOL}
        //       placeholder='Enter vote amount'
        //       style={{ marginRight: 20 }}
        //     />
        //     <Button type='primary'>All In</Button>
        //   </div>
        // )
        render: (
          <span className='form-item-value'>
            {voteFromExpiredVoteAmount} {SYMBOL}
          </span>
        )
      }
      // {
      //   label: '预估投票收益',
      //   render: (
      //     <div>
      //       <Input />
      //       <span className='tip-color' style={{ marginLeft: 10 }}>
      //         投票收益=(锁定期*票数/总票数)*分红池奖励*20%
      //       </span>
      //     </div>
      //   )
      // }
    ]
  };

  need.forEach(item => {
    res.formItems.push(
      materials.formItems.find(oneType => oneType.type === item)
    );
  });

  return res;
}

class VoteContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // todo: sort out the state
      nightElf: null,

      voteModalVisible: false,
      pluginLockModalVisible: false,
      voteConfirmModalVisible: false,
      voteRedeemModalVisible: false,
      voteConfirmForm: {},
      voteRedeemForm: {},
      voteFrom: 1,
      currentWallet: null,

      consensusContract: contractsStore.consensusContract,
      dividendContract: contractsStore.dividendContract,
      multiTokenContract: contractsStore.multiTokenContract,
      voteContract: contractsStore.voteContract,
      electionContract: contractsStore.electionContract,
      profitContract: contractsStore.profitContract,

      voteContractFromExt: null,
      electionContractFromExt: null,
      profitContractFromExt: null,

      showDownloadPlugin: false,
      balance: null,
      formatedBalance: null,
      nodeAddress: null,
      nodeName: null,
      currentWalletName: null,
      voteAmountInput: null,
      lockTime: null,
      isCandidate: false,
      expiredVotesAmount: 0,
      activeVotingRecords: [],
      switchableVoteRecords: [],
      withdrawnableVoteRecords: [],
      switchVoteAmount: 0,
      voteFromExpiredVoteAmount: null,
      voteType: FROM_WALLET,
      switchVoteSelectedRowKeys: [],
      voteFromExpiredSelectedRowKeys: [],
      dividendModalVisible: false,
      dividends: {
        total: 0,
        amounts: []
      },
      // todo: remove useless state
      totalVoteAmountForOneCandidate: 0,
      totalWithdrawnableVoteAmountForOneCandidate: 0,
      redeemableVoteRecordsForOneCandidate: [],
      activeVoteRecordsForOneCandidate: [],
      redeemVoteSelectedRowKeys: [],

      targetPublicKey: null,
      shouldRefreshNodeTable: false,
      shouldRefreshMyWallet: false,
      shouldRefreshElectionNotifiStatis: false,
      voteToRedeem: {
        nodeName: null,
        nodeAddress: null,
        amount: null,
        voteId: {
          value: null
        }
      },
      redeemOneVoteModalVisible: false,
      isLockTimeForTest: false,
      isPluginLock: false
    };

    this.changeModalVisible = this.changeModalVisible.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.voteNextCallback = this.voteNextCallback.bind(this);
    // this.handleAllIn = this.handleAllIn.bind(this);
    this.handleLockTimeChange = this.handleLockTimeChange.bind(this);
    this.handleVoteConfirmOk = this.handleVoteConfirmOk.bind(this);
    this.handleVoteTypeChange = this.handleVoteTypeChange.bind(this);
    this.handleSwithVoteSelectedRowChange = this.handleSwithVoteSelectedRowChange.bind(
      this
    );
    this.handleVoteFromExpiredSelectedRowChange = this.handleVoteFromExpiredSelectedRowChange.bind(
      this
    );
    this.handleRedeemVoteSelectedRowChange = this.handleRedeemVoteSelectedRowChange.bind(
      this
    );
    this.handleRedeemConfirm = this.handleRedeemConfirm.bind(this);
    this.handleDividendClick = this.handleDividendClick.bind(this);
    this.handleClaimDividendClick = this.handleClaimDividendClick.bind(this);
    this.changeVoteState = this.changeVoteState.bind(this);
    this.checkExtensionLockStatus = this.checkExtensionLockStatus.bind(this);
    this.handleRedeemOneVoteConfirm = this.handleRedeemOneVoteConfirm.bind(
      this
    );
    // this.refreshPageElectionNotifi = this.refreshPageElectionNotifi.bind(this);

    this.formGroup = null;
    // this.profitContractFromExt = null;
    // this.electionContractFromExt = null;
    this.hasGetContractsFromExt = false;
  }

  async componentDidMount() {
    const { history } = this.props;
    // Get contracts
    try {
      const result = await getContractAddress();
      if (!result.chainInfo) {
        message.error(
          'The chain has stopped or cannot be connected to the chain. Please check your network or contact us.',
          10
        );
        return;
      }
      contractsNeedToLoad.forEach((contractItem, index) => {
        this.getContractByContractAddress(
          result,
          contractItem.contractAddrValName,
          contractItem.contractNickname
        );
      });
    } catch (e) {
      // message.error(e);
      console.error(e);
    }
    this.getExtensionKeypairList();

    console.log({
      history
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { shouldRefreshMyWallet } = this.state;
    if (shouldRefreshMyWallet) {
      // todo: put the method fetchProfitAmount run with the refresh of wallet
      this.fetchProfitAmount();
    }
  }

  getWalletBalance() {
    const { currentWallet, multiTokenContract } = this.state;
    return multiTokenContract.GetBalance.call({
      symbol: SYMBOL,
      owner: currentWallet.address
    });
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
    console.log('result[contractAddrValName]', result[contractAddrValName]);
    aelf.chain
      .contractAt(result[contractAddrValName], result.wallet)
      .then(res => {
        console.log('res', res);
        contractsStore.setContract(contractNickname, res);
        this.setState(
          { [contractNickname]: contractsStore[contractNickname] },
          () => {
            // todo: use switch/case
            if (contractNickname === 'consensusContract') {
              // todo: what's this used for?
              this.chainInfo = res;
              // todo: We shouldn't get vote info by consensus contract
              // this.getInformation(result);
            }

            if (contractNickname === 'electionContract') {
              this.judgeIsCandidate();
            }

            // if (contractNickname === 'profitContract') {
            //   this.fetchProfitAmount();
            // }
          }
        );
      })
      .catch(err => console.error('err', err));
  }

  getExtensionKeypairList() {
    const httpProvider = DEFAUT_RPC_SERVER;

    NightElfCheck.getInstance()
      .check.then(item => {
        if (item) {
          const nightElf = new window.NightElf.AElf({
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
            APPNAME // TODO: 这个需要content.js 主动获取
          });
          console.log('nightElf', nightElf);
          if (nightElf) {
            this.setState({
              nightElf
            });
            // We can not do the work using extension here as the wallet maybe not stored in local yet.
            nightElf.chain.getChainStatus((error, result) => {
              if (result) {
                if (result.error === 200005) {
                  message.warning(result.errorMessage.message, 3);
                  this.setState({
                    isPluginLock: true
                  });
                  return;
                }
                this.setState({
                  isPluginLock: false
                });
                nightElf.checkPermission(
                  {
                    APPNAME,
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
          showDownloadPlugin: true
        });
      });
  }

  getNightElfKeypair(wallet) {
    if (wallet) {
      console.log('wallet', wallet);
      wallet.pubkey = '04' + wallet.publicKey.x + wallet.publicKey.y;
      localStorage.setItem('currentWallet', JSON.stringify(wallet));
      this.setState({
        currentWallet: wallet,
        showWallet: true
      });
    }
  }

  handleSwithVoteSelectedRowChange(selectedRowKeys, selectedRows) {
    console.log('selectedRows', selectedRows);
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    const switchVoteAmount = selectedRows.reduce(
      (total, current) => total + +current.amount,
      0
    );
    this.setState({
      switchVoteSelectedRowKeys: selectedRowKeys,
      switchVoteAmount
    });
  }

  handleVoteFromExpiredSelectedRowChange(selectedRowKeys, selectedRows) {
    console.log('selectedRows', selectedRows);
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    const voteFromExpiredVoteAmount = selectedRows.reduce(
      (total, current) => total + +current.amount,
      0
    );
    this.setState({
      voteFromExpiredSelectedRowKeys: selectedRowKeys,
      voteFromExpiredVoteAmount
    });
  }

  handleRedeemVoteSelectedRowChange(selectedRowKeys, selectedRows) {
    console.log('selectedRows', selectedRows);
    console.log('selectedRowKeys changed: ', selectedRowKeys);

    this.setState({
      redeemVoteSelectedRowKeys: selectedRowKeys
    });
  }

  insertKeypairs(checkPermissionResult) {
    if (checkPermissionResult && checkPermissionResult.error === 0) {
      this.setState({
        isPluginLock: false
      });
      this.loginPlugin(checkPermissionResult);
      return;
    }
    // todo: There are some same codes
    if (checkPermissionResult.error === 200005) {
      message.warning(checkPermissionResult.errorMessage.message, 3);
      this.setState({
        isPluginLock: true
      });
      // return Promise.reject('Plugin lock!');
    }
  }

  loginPlugin(checkPermissionResult) {
    const { nightElf } = this.state;
    const getLoginPayload = {
      appName: APPNAME
    };
    return new Promise((resolve, reject) => {
      getLogin(nightElf, getLoginPayload, result => {
        // todo: try to extract the code handle the result from extension as there are some repeating code
        if (result && result.error === 0) {
          console.log('result', result);
          const wallet = JSON.parse(result.detail);
          if (checkPermissionResult.permissions.length) {
            // EXPLAIN: Need to redefine this scope
            const payload = {
              appName: APPNAME,
              result: checkPermissionResult
            };
            checkPermissionRepeat(nightElf, payload, () => {
              this.getNightElfKeypair(wallet);
              // todo: Extract
              this.onExtensionAndWalletReady().then(() => {
                resolve();
              });
            });
          } else {
            this.getNightElfKeypair(wallet);
            // todo: Extract
            this.onExtensionAndWalletReady().then(() => {
              resolve();
            });
            message.success('Login success!!', 3);
          }
        } else {
          message.error(result.errorMessage.message, 3);
        }
      });
    });
  }

  onExtensionAndWalletReady() {
    return this.fetchContractFromExt()
      .then(() => {
        this.hasGetContractsFromExt = true;
        this.fetchProfitAmount();
      })
      .catch(err => {
        console.error('fetchContractFromExt', err);
      });
  }

  fetchContractFromExt() {
    const { nightElf } = this.state;
    const { contractsNeedToLoadFromExt } = constants;

    const currentWallet = getCurrentWallet();
    const wallet = {
      address: currentWallet.address
    };
    // todo: get the contract from extension in cdm or other suitable time
    // todo: using the code as follows instead the repeat code in project
    // todo: error handle
    // todo: If some contract load fail, will it cause problem?
    // todo: Consider to get the contract seperately
    return Promise.all(
      contractsNeedToLoadFromExt.map(item => {
        return nightElf.chain
          .contractAt(config[item.contractAddrValName], wallet)
          .then(res => {
            console.log('Load contracts need to load from extension: ', res);
            this.setState({
              [item.contractNickname]: res
            });
          })
          .catch(err => console.error(err));
      })
    );
  }

  changeModalVisible(modal, visible) {
    this.setState({
      [modal]: visible
    });
  }

  changeVoteState(obj, callback) {
    this.setState(obj, callback);
  }

  handleOk(visible, cb) {
    // this.setState({
    //   // ModalText: 'The modal will be closed after two seconds',
    //   // confirmLoading: true,
    // });
    // setTimeout(() => {
    this.setState(
      {
        [visible]: false
        // confirmLoading: false,
      },
      cb
    );
    // }, 2000);
  }

  handleCancel(visible) {
    console.log('Clicked cancel button');
    this.setState({
      [visible]: false
    });
  }

  fetchDataVoteNeed() {
    const { electionContract } = this.state;
    const currentWallet = getCurrentWallet();

    Promise.all([
      electionContract.GetElectorVoteWithRecords.call({
        value: `04${currentWallet.publicKey.x}${currentWallet.publicKey.y}`
      }),
      getAllTeamDesc()
    ])
      .then(resArr => {
        console.log('fetchDataVoteNeed', resArr);
        this.processDataVoteNeed(resArr);
      })
      .catch(err => {
        console.error('GetElectorVote', err);
      });
  }

  processDataVoteNeed(resArr) {
    // todo: the process code are  similar, can i unify it? Don't forget to consider the changablity.
    const { targetPublicKey } = this.state;
    const electorVote = resArr[0];
    let allTeamInfo = null;
    let expiredVotesAmount = 0;
    if (resArr[1].code === 0) {
      allTeamInfo = resArr[1].data;
    }
    const {
      activeVotingRecords,
      allVotedVotesAmount,
      activeVotedVotesAmount
    } = electorVote;
    const switchableVoteRecords = [];
    const withdrawnableVoteRecords = [];
    activeVotingRecords.forEach(record => {
      // filter the vote voted to other node
      if (record.candidate === targetPublicKey) return;
      // filter the vote don't expired
      // todo: extract the judge code, there are some same code in page "my vote"
      if (record.unlockTimestamp.seconds > moment().unix()) {
        switchableVoteRecords.push(record);
        return;
      }
      // the vote expired can be withdrawn
      withdrawnableVoteRecords.push(record);
      expiredVotesAmount += +record.amount;
    });

    [...switchableVoteRecords, ...withdrawnableVoteRecords].forEach(record => {
      const { voteTimestamp, lockTime } = record;
      const teamInfo = allTeamInfo.find(
        team => team.public_key === record.candidate
      );
      console.log('teamInfo', teamInfo);
      if (teamInfo === undefined) {
        record.name = publicKeyToAddress(record.candidate);
      } else {
        record.name = teamInfo.name;
      }
      // Antd's Table's datasource needs key
      record.key = record.voteId.value;

      // todo: unify lock time & vote time's handler
      // todo: fix the lock time
      record.formatedLockTime = `${(lockTime / 24 / 60 / 60).toFixed(1)} Days`;
      record.formatedVoteTime = moment
        .unix(voteTimestamp.seconds)
        .format('YYYY-MM-DD HH:mm:ss');
    });
    this.setState({
      expiredVotesAmount,
      activeVotingRecords,
      switchableVoteRecords,
      withdrawnableVoteRecords
    });
  }

  judgeIsCandidate() {
    const { electionContract } = this.state;
    const currentWallet = getCurrentWallet();
    if (!currentWallet.publicKey) {
      console.log("The user didn't storage the publicKey to localStorage yet");
      return;
    }
    // todo: unify the pubkey's getter
    electionContract.GetCandidateInformation.call({
      value: `04${currentWallet.publicKey.x}${currentWallet.publicKey.y}`
    })
      .then(res => {
        console.log('GetCandidateInformation', res);
        this.setState({
          isCandidate: res.isCurrentCandidate
        });
      })
      .catch(err => {
        console.error('GetCandidateInformation', err);
      });
  }

  handleClick(e) {
    // todo: handle the useless click
    const ele = e.target;
    if (!ele.dataset.role) return;
    // To make sure that all the operation use wallet take effects on the correct wallet
    // It can only be lower case
    const { shoulddetectlock, votetype } = ele.dataset;
    if (shoulddetectlock) {
      this.checkExtensionLockStatus()
        .then(() => {
          switch (ele.dataset.role) {
            case 'vote':
              this.setState(
                {
                  voteType: votetype
                },
                () => {
                  this.handleVoteClick(ele);
                }
              );
              break;
            case 'redeem':
              this.handleRedeemClick(ele);
              break;
            case 'redeemOne':
              this.handleRedeemOneVote(ele);
              break;
            default:
              break;
          }
        })
        .catch(err => {
          console.log('err', err);
        });
      // todo: use async instead
    }
  }

  handleRedeemOneVote(ele) {
    const {
      nodeaddress: nodeAddress,
      nodename: nodeName,
      amount,
      voteid
    } = ele.dataset;
    const voteId = JSON.parse(voteid);
    console.log('<<<<', voteId);

    this.setState({
      voteToRedeem: {
        nodeName,
        nodeAddress,
        amount,
        voteId
      },
      redeemOneVoteModalVisible: true
    });
  }

  handleRedeemOneVoteConfirm() {
    const { voteToRedeem } = this.state;

    // todo: get the contract from extension in cdm or other suitable time
    // todo: error handle
    this.redeemSomeVote([voteToRedeem.voteId.value]);
    // todo: use async instead
    setTimeout(() => {
      this.setState({
        redeemOneVoteModalVisible: false
      });
    }, 4000);
  }

  checkExtensionLockStatus() {
    const { nightElf } = this.state;
    const currentWallet = getCurrentWallet();

    return new Promise((resolve, reject) => {
      // Calling getChainStatus to make the extension connect the chain
      // todo: There are some same code.
      nightElf
        .checkPermission({
          appName: APPNAME,
          type: 'addresss',
          address: currentWallet.address
        })
        .then(checkPermissionResult => {
          // When plugin is lock
          if (checkPermissionResult.error !== 0) {
            const { errorMessage } = checkPermissionResult;
            message.warning(errorMessage.message, 3);
            this.hasGetContractsFromExt = false; // Need to get contracts from ext again once plugin is locked.
            throw new Error(errorMessage.message);
          }
          if (!this.hasGetContractsFromExt) {
            // todo: Unify the format of extension's function return, the function getChainStatus's response is different with others.s
            nightElf.chain.getChainStatus().then(() => {
              this.loginPlugin(checkPermissionResult).then(() => {
                resolve();
              });
            });
            return;
          }
          resolve();
        });
    });
  }

  handleVoteClick(ele) {
    this.getWalletBalance()
      .then(res => {
        // todo: unify balance formater: InputNumber's and thousandsCommaWithDecimal's
        const balance = +res.balance / ELF_DECIMAL;
        const formatedBalance = thousandsCommaWithDecimal(balance);
        this.fetchDataVoteNeed();

        this.setState(
          {
            balance,
            nodeAddress: ele.dataset.nodeaddress,
            targetPublicKey: ele.dataset.targetpublickey,
            currentWalletName: JSON.parse(localStorage.getItem('currentWallet'))
              .name,
            formatedBalance,
            nodeName: ele.dataset.nodename || ''
          },
          () => {
            const { targetPublicKey } = this.state;
            console.log({
              targetPublicKey
            });
          }
        );
        this.changeModalVisible('voteModalVisible', true);
      })
      .then(() => {
        this.changeModalVisible('voteModalVisible', true);
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleRedeemClick(ele) {
    const { nodename, nodeaddress, targetpublickey } = ele.dataset;
    // todo: use arrow function or others method instead the data binded to element
    // It looks like jQuery's way.
    // todo: consider remove all the form in state
    // const voteRedeemForm = generateVoteRedeemForm().call();
    // totalWithdrawnableVoteAmountForOneCandidate
    // totalVoteAmountForOneCandidate
    // nodeaddress;

    this.setState(
      {
        nodeName: nodename || 'Default', // todo: use const instead
        nodeAddress: nodeaddress,
        voteRedeemModalVisible: true,
        targetPublicKey: targetpublickey
      },
      () => {
        this.fetchUserVoteRecords();
      }
    );
  }

  handleRedeemConfirm() {
    // todo: should nightElf place in state?
    const { redeemVoteSelectedRowKeys } = this.state;

    this.redeemSomeVote(redeemVoteSelectedRowKeys);
  }

  async redeemSomeVote(votesToRedeem) {
    const { electionContractFromExt } = this.state;
    // todo: I run it as serial mode as the extension can only open one prompt in one time and the contract didn't support withdrawn many votes with a method
    // todo: After modify the contract don't forget to modify the code as follows
    votesToRedeem.forEach(async item => {
      const payload = { value: item };
      await electionContractFromExt
        .Withdraw(payload)
        .then(res => {
          this.checkTransactionResult(res, 'voteRedeemModalVisible')
            .then(() => {
              // todo: only do the refresh in page election
              this.refreshPageElectionNotifi();
            })
            .catch(err => {
              console.error('checkTransactionResult', {
                err
              });
            });
        })
        .catch(err => console.error(err));
    });
    // todo: use Promise's finally instead
    this.setState({
      redeemVoteSelectedRowKeys: []
    });
  }

  fetchUserVoteRecords() {
    const { electionContract, targetPublicKey } = this.state;
    const currentWallet = getCurrentWallet();

    electionContract.GetElectorVoteWithRecords.call({
      value: currentWallet.pubKey
    })
      .then(res => {
        // todo: error handle
        console.log('GetElectorVoteWithRecords', res);
        const activeVoteRecordsForOneCandidate = res.activeVotingRecords.filter(
          item => item.candidate === targetPublicKey
        );
        const redeemableVoteRecordsForOneCandidate = this.computeRedeemableVoteRecords(
          activeVoteRecordsForOneCandidate
        );
        console.log(
          'redeemableVoteRecordsForOneCandidate',
          redeemableVoteRecordsForOneCandidate
        );

        redeemableVoteRecordsForOneCandidate.forEach(item => {
          item.formatedLockTime = getFormatedLockTime(item);
          item.formatedVoteTime = moment
            .unix(item.voteTimestamp.seconds)
            .format('YYYY-MM-DD HH:mm:ss');
          // todo: use the name team submit instead
          item.name = publicKeyToAddress(item.candidate);
        });

        // todo: consider to generate redeemableVoteRecordsForOneCandidate in component RedeemModal, it will reduce state's counts
        this.setState({
          activeVoteRecordsForOneCandidate,
          redeemableVoteRecordsForOneCandidate
        });
      })
      .catch(err => {
        console.log('GetElectorVoteWithRecords', err);
      });
  }

  computeRedeemableVoteRecords(records) {
    return records.filter(
      item => item.unlockTimestamp.seconds < moment().unix()
    );
  }

  voteNextCallback() {
    const { voteType } = this.state;
    let voteConfirmForm = null;
    console.log('voteType', voteType);
    // todo: Use voteTypeFormItemsMap instead in proper time
    switch (voteType) {
      case FROM_WALLET:
        voteConfirmForm = generateVoteConfirmForm.call(this, {
          need: ['voteAmount', 'lockTime']
        });
        break;
      case FROM_EXPIRED_VOTES:
        voteConfirmForm = generateVoteConfirmForm.call(this, {
          need: ['voteFromExpiredVoteAmount', 'lockTime']
        });
        break;
      case FROM_ACTIVE_VOTES:
        voteConfirmForm = generateVoteConfirmForm.call(this, {
          // todo: add lock time when choose
          // need: ['lockTime', 'nodeName', 'nodeAddress', 'switchVoteAmount']
          need: ['nodeName', 'nodeAddress', 'switchVoteAmount']
        });
        break;
      default:
        break;
    }

    console.log('voteConfirmForm', voteConfirmForm);

    this.setState(
      {
        voteConfirmForm,
        voteModalVisible: false
      },
      () => {
        console.log('Closed vote modal!');
        this.setState({
          voteConfirmModalVisible: true
        });
      }
    );
  }

  handleLockTimeChange(value) {
    const { dividendContract } = this.state;
    console.log('value', value);
    this.setState(
      {
        lockTime: value
      }
      // () => {
      //   if (value === null) return;
      //   dividendContract.GetWelfareRewardAmountSample.call({
      //     value: [25920000, 51840000, 77760000]
      //   })
      //     .then(res => {
      //       console.log('GetWelfareRewardAmountSample', res);
      //     })
      //     .catch(err => {
      //       console.error('GetWelfareRewardAmountSample', err);
      //     });
      // }
    );
  }

  // togglePluginLockModal(flag) {
  //   console.log('<<<<', flag);
  //   voteStore.setPluginLockModalVisible(flag);
  //   reaction(
  //     () => voteStore.pluginLockModalVisible,
  //     pluginLockModalVisible => this.setState({ pluginLockModalVisible })
  //   );
  // }

  handleVoteConfirmOk() {
    const { voteType } = this.state;

    // todo: get the contract from extension in cdm or other suitable time
    // todo: error handle
    switch (voteType) {
      case FROM_WALLET:
        this.handleVoteFromWallet();
        break;
      case FROM_EXPIRED_VOTES:
        this.handleVoteFromExpiredVote();
        break;
      case FROM_ACTIVE_VOTES:
        this.handleSwitchVote();
        break;
      default:
        break;
    }
  }

  handleVoteFromWallet() {
    const {
      voteAmountInput,
      targetPublicKey,
      isLockTimeForTest,
      electionContractFromExt
    } = this.state;
    let { lockTime } = this.state;
    // const timeMS = moment(lockTime).getMilliseconds();
    // console.log('ms', timeMS);
    const lockTimeForTest = moment().add(4, 'minutes');
    lockTime = isLockTimeForTest ? lockTimeForTest : lockTime;
    console.log({
      targetPublicKey,
      electionContractFromExt
    });
    const payload = {
      // candidatePubkey:
      // '041f1af590bc633b30efef64f971f5e12ccd7d20a4b88fceb3f489fd3b787bc274695e8ba55574c502d8572916773c5bb74e93ad375c02014360e496098c74b4fa',
      candidatePubkey: targetPublicKey,
      // amount: 100,
      // todo: add decimal or not
      amount: voteAmountInput,
      endTimestamp: {
        // Seconds: Math.floor(timeMS / 1000),
        // Nanos: (timeMS % 1000) * 1e6
        seconds: lockTime.unix(),
        nanos: lockTime.milliseconds() * 1000
      }
    };

    electionContractFromExt
      .Vote(payload)
      .then(res => {
        if (res) {
          this.checkTransactionResult(res).then(() => {
            // Close tow modal as there are two situcation, one open a modal and anothor open two modals.
            // Consider to do the samething after checkTransactionResult in the same page.
            this.setState(
              {
                voteConfirmModalVisible: false,
                voteModalVisible: false
              },
              () => {
                this.refreshPageElectionNotifi();
              }
            );
          });
        } else {
          message.error(res.errorMessage.message, 3);
          this.setState({
            isLockTimeForTest: false
          });
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({
          isLockTimeForTest: false
        });
      });
  }

  refreshPageElectionNotifi() {
    this.setState({
      shouldRefreshNodeTable: true,
      shouldRefreshMyWallet: true,
      shouldRefreshElectionNotifiStatis: true,
      isLockTimeForTest: false
    });
  }

  handleVoteFromExpiredVote() {
    const { voteFromExpiredVoteAmount, withdrawnableVoteRecords } = this.state;

    // todo: optimize the method
    const votesToRedeem = [];
    const sortedRedeemableVoteRecords = withdrawnableVoteRecords.sort(
      (a, b) => b.amount - a.amount
    );
    let voteIdsToRedeem = null;
    for (let i = 0; i < sortedRedeemableVoteRecords.length; i++) {
      const item = sortedRedeemableVoteRecords[i];
      votesToRedeem.push(item);
      const totalAmount = votesToRedeem.reduce(
        (total, current) => total + +current.amount,
        0
      );
      if (totalAmount >= voteFromExpiredVoteAmount) {
        break;
      }
    }
    voteIdsToRedeem = votesToRedeem.map(item => item.voteId.value);

    this.redeemSomeVote(voteIdsToRedeem);

    console.log({
      votesToRedeem,
      withdrawnableVoteRecords,
      voteFromExpiredVoteAmount,
      sortedRedeemableVoteRecords
    });
  }

  // todo: global node address are public key actually
  handleSwitchVote() {
    const { electionContractFromExt, targetPublicKey } = this.state;
    // todo: limit max change num or handle the concurreny problem
    const { switchVoteSelectedRowKeys } = this.state;
    const payload = {
      voteId: { value: switchVoteSelectedRowKeys[0] },
      candidatePubkey: targetPublicKey
    };
    electionContractFromExt
      .ChangeVotingOption(payload)
      .then(res => {
        console.log('ChangeVotingOption', res);
        return this.checkTransactionResult(res).then(() => {
          // Close tow modal as there are two situcation, one open a modal and anothor open two modals.
          // Consider to do the samething after checkTransactionResult in the same page.
          this.setState(
            {
              voteConfirmModalVisible: false,
              voteModalVisible: false
            },
            () => {
              this.refreshPageElectionNotifi();
            }
          );
        });
      })
      .catch(err => {
        console.error('ChangeVotingOption', err);
      });

    // todo: use to switch many votes, but encountered bug
    // switchVoteSelectedRowKeys.forEach(voteId => {
    //   const payload = {
    //     voteId: { value: voteId },
    //     candidatePubkey
    //   };
    //   electionContractFromExt
    //     .ChangeVotingOption(payload)
    //     .then(res => {
    //       console.log('ChangeVotingOption', res);
    //       this.checkTransactionResult(res);
    //       this.changeModalVisible('voteConfirmModalVisible', false);
    //     })
    //     .catch(err => {
    //       console.error('ChangeVotingOption', err);
    //     });
    // });
  }

  // todo: use this method instead repeat code
  checkTransactionResult(res, modalToClose) {
    const transactionId = res.result
      ? res.result.TransactionId
      : res.TransactionId;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('transactionId', transactionId);
        aelf.chain.getTxResult(transactionId, (error, result) => {
          console.log('result', JSON.stringify(result));
          if (!result) {
            message.info(
              "Temporaryly didn' get the transaction info. Please query the transaction later"
            );
            message.info(`Your transaction id is: ${transactionId}`);
            reject();
            return;
          }
          getStateJudgment(result.Status, transactionId);
          // todo: use the modalToClose instead the VoteConfirmModal's code
          if (modalToClose) {
            setTimeout(() => {
              this.changeModalVisible(modalToClose, false);
            }, 500);
          }
          // todo: return resolve for all four status, consider to return resolve just for the 'mined', 'pending'
          resolve();
        });
      }, 4000);
    });
    // todo: optimize the timeout
  }

  handleVoteTypeChange(voteType) {
    this.setState({
      voteType
    });
  }

  // FIXME: the time calling this method maybe unsuitable
  // FIXME: when the user didn't set the wallet, will it cause problem?
  fetchProfitAmount() {
    // After fetch all data, do the setState work
    // It will reduce the setState's call times to one
    const { profitContractFromExt } = this.state;

    Promise.all(
      schemeIds.map(item => {
        return profitContractFromExt.GetProfitAmount.call({
          symbol: SYMBOL,
          schemeId: item.schemeId
        });
      })
    )
      .then(resArr => {
        console.log('GetAllProfitAmount', resArr);
        let total = 0;
        const dividendAmounts = schemeIds.map((item, index) => {
          let amount = null;
          const profitItem = resArr[index];
          if (profitItem.error) {
            amount = 0;
          } else {
            amount = +profitItem.value;
          }
          // todo: remove the judge when need
          amount = amount === undefined ? 0 : +amount / ELF_DECIMAL;
          total += amount;
          return {
            type: item.type,
            amount,
            schemeId: item.schemeId
          };
        });
        const dividends = {
          total,
          amounts: dividendAmounts
        };
        this.setState({
          dividends
        });
        // todo: maybe wrong
        console.log("In state' dividends", dividends);
      })
      .catch(err => {
        console.error('GetAllProfitAmount', err);
      });
  }

  handleDividendClick() {
    this.checkExtensionLockStatus()
      .then(() => {
        this.fetchProfitAmount();
        this.setState({
          dividendModalVisible: true
        });
      })
      .catch(err => {
        console.error('checkExtensionLockStatus', err);
      });
  }

  handleDividendChange(key, value) {
    const { dividends } = this.state;
    dividends.amounts[key] = value;
    dividends.total = dividends.amounts.reduce((total, current) => {
      return total + +current;
    }, 0);
    this.setState({
      dividends
    });
  }

  handleClaimDividendClick(schemeId) {
    const { profitContractFromExt } = this.state;
    this.checkExtensionLockStatus()
      .then(() => {
        profitContractFromExt
          .ClaimProfits({
            schemeId,
            symbol: SYMBOL
          })
          .then(res => {
            console.log('handleClaimDividendClick', res);
            this.checkTransactionResult(res, 'dividendModalVisible').then(
              () => {
                this.setState({
                  shouldRefreshMyWallet: true
                });
              }
            );
          })
          .catch(err => {
            console.error('handleClaimDividendClick', err);
          });
      })
      .catch(err => {
        console.error('checkExtensionLockStatus', err);
      });
  }

  render() {
    const {
      voteModalVisible,
      pluginLockModalVisible,
      voteConfirmModalVisible,
      voteRedeemModalVisible,
      voteConfirmForm,
      voteRedeemForm,
      showDownloadPlugin,

      voteContract,
      electionContract,
      multiTokenContract,
      profitContract,
      dividendContract,
      consensusContract,

      electionContractFromExt,

      balance,
      formatedBalance,
      nodeAddress,
      nodeName,
      currentWallet,
      currentWalletName,
      voteAmountInput,
      voteFromExpiredVoteAmount,
      lockTime,
      nightElf,
      isCandidate,
      expiredVotesAmount,
      switchableVoteRecords,
      withdrawnableVoteRecords,
      voteType,
      switchVoteSelectedRowKeys,
      voteFromExpiredSelectedRowKeys,
      redeemVoteSelectedRowKeys,
      dividendModalVisible,
      redeemableVoteRecordsForOneCandidate,
      activeVoteRecordsForOneCandidate,
      dividends,
      shouldRefreshNodeTable,
      shouldRefreshMyWallet,
      voteToRedeem,
      redeemOneVoteModalVisible,
      shouldRefreshElectionNotifiStatis,
      isPluginLock,
      isLockTimeForTest
    } = this.state;

    // todo: decouple
    // this.formGroup = generateFormGroup.call(this, { nodeAddress: null });
    return (
      // todo: place the Provider in the uppest container
      <Provider contractsStore={contractsStore}>
        <section className='vote-container' onClick={this.handleClick}>
          {showDownloadPlugin ? (
            <DownloadPlugins style={{ margin: '0 56px' }} />
          ) : null}

          {/* todo: optimize the radio group */}
          <Radio.Group
            className='secondary-level-nav'
            value={window.location.pathname}
          >
            <Radio
              value={routePaths.electionNotifi}
              onClick={() => {
                this.props.history.push(routePaths.electionNotifi);
              }}
            >
              Election Notification
            </Radio>
            <Radio
              value={routePaths.myVote}
              onClick={() => {
                this.props.history.push(routePaths.myVote);
              }}
            >
              My Vote
            </Radio>
          </Radio.Group>

          <Switch>
            <Route
              exact
              path='/vote/election'
              render={() => (
                <ElectionNotification
                  multiTokenContract={multiTokenContract}
                  voteContract={voteContract}
                  electionContract={electionContract}
                  profitContract={profitContract}
                  dividendContract={dividendContract}
                  consensusContract={consensusContract}
                  nightElf={nightElf}
                  isCandidate={isCandidate}
                  handleDividendClick={this.handleDividendClick}
                  dividends={dividends}
                  electionContractFromExt={electionContractFromExt}
                  shouldRefreshNodeTable={shouldRefreshNodeTable}
                  shouldRefreshMyWallet={shouldRefreshMyWallet}
                  changeVoteState={this.changeVoteState}
                  checkExtensionLockStatus={this.checkExtensionLockStatus}
                  shouldRefreshElectionNotifiStatis={
                    shouldRefreshElectionNotifiStatis
                  }
                  refreshPageElectionNotifi={this.refreshPageElectionNotifi}
                  currentWallet={currentWallet}
                />
              )}
            />
            <Route
              exact
              path={routePaths.applyToBeANode}
              electionContract={electionContract}
              render={() => (
                <CandidateApply
                  electionContract={electionContract}
                  nightElf={nightElf}
                />
              )}
            />
            <Route
              path={routePaths.teamInfoKeyin}
              render={() => (
                <KeyInTeamInfo
                  electionContract={electionContract}
                  currentWallet={currentWallet}
                  nightElf={nightElf}
                  isPluginLock={isPluginLock}
                  checkExtensionLockStatus={this.checkExtensionLockStatus}
                />
              )}
            />
            <Route
              path={routePaths.teamDetail}
              render={() => (
                <TeamDetail
                  consensusContract={consensusContract}
                  electionContract={electionContract}
                  currentWallet={currentWallet}
                />
              )}
            />
            <Route
              path={routePaths.myVote}
              render={() => (
                <MyVote
                  electionContract={electionContract}
                  handleVoteTypeChange={this.handleVoteTypeChange}
                />
              )}
            />
            <Redirect from={routePaths.vote} to={routePaths.electionNotifi} />
          </Switch>

          <VoteModal
            voteModalVisible={voteModalVisible}
            nodeAddress={nodeAddress}
            nodeName={nodeName}
            currentWalletName={currentWalletName}
            balance={balance}
            callback={this.handleVoteConfirmOk}
            onCancel={this.handleCancel.bind(this, 'voteModalVisible')}
            handleSwitchVoteAmountChange={this.handleSwitchVoteAmountChange}
            handleLockTimeChange={this.handleLockTimeChange}
            voteAmountInput={voteAmountInput}
            lockTime={lockTime}
            expiredVotesAmount={expiredVotesAmount}
            switchableVoteRecords={switchableVoteRecords}
            withdrawnableVoteRecords={withdrawnableVoteRecords}
            handleSwitchVote={this.handleSwitchVote}
            handleVoteTypeChange={this.handleVoteTypeChange}
            voteType={voteType}
            handleSwithVoteSelectedRowChange={
              this.handleSwithVoteSelectedRowChange
            }
            switchVoteSelectedRowKeys={switchVoteSelectedRowKeys}
            voteFromExpiredVoteAmount={voteFromExpiredVoteAmount}
            voteFromExpiredSelectedRowKeys={voteFromExpiredSelectedRowKeys}
            handleVoteFromExpiredSelectedRowChange={
              this.handleVoteFromExpiredSelectedRowChange
            }
            changeVoteState={this.changeVoteState}
            isLockTimeForTest={isLockTimeForTest}
          />

          <Modal
            className='plugin-lock-modal'
            visible={pluginLockModalVisible}
            onOk={() => this.handleOk('pluginLockModalVisible')}
            // confirmLoading={confirmLoading}
            onCancel={() => this.handleCancel('pluginLockModalVisible')}
            centered
            maskClosable
            keyboard
          >
            您的NightELF已锁定，请重新解锁
          </Modal>

          <Modal
            className='vote-confirm-modal'
            title='Vote Confirm'
            visible={voteConfirmModalVisible}
            onOk={this.handleVoteConfirmOk}
            // confirmLoading={confirmLoading}
            onCancel={this.handleCancel.bind(this, 'voteConfirmModalVisible')}
            width={860}
            centered
            maskClosable
            keyboard
          >
            <Form {...voteConfirmFormItemLayout} onSubmit={this.handleSubmit}>
              {voteConfirmForm.formItems &&
                voteConfirmForm.formItems.map(item => {
                  return (
                    <Form.Item label={item.label} key={item.label}>
                      {/* {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!'
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(<Input />)} */}
                      {item.render ? item.render : <Input />}
                    </Form.Item>
                  );
                })}
            </Form>
            <p className='tip-color' style={{ marginTop: 30 }}>
              {NEED_PLUGIN_AUTHORIZE_TIP}
            </p>
          </Modal>

          <RedeemModal
            nodeAddress={nodeAddress}
            nodeName={nodeName}
            voteRedeemModalVisible={voteRedeemModalVisible}
            handleRedeemConfirm={this.handleRedeemConfirm}
            handleCancel={this.handleCancel}
            redeemableVoteRecordsForOneCandidate={
              redeemableVoteRecordsForOneCandidate
            }
            activeVoteRecordsForOneCandidate={activeVoteRecordsForOneCandidate}
            currentWallet={currentWallet}
            redeemVoteSelectedRowKeys={redeemVoteSelectedRowKeys}
            handleRedeemVoteSelectedRowChange={
              this.handleRedeemVoteSelectedRowChange
            }
            changeVoteState={this.changeVoteState}
          />

          <RedeemAnVoteModal
            currentWallet={currentWallet}
            voteToRedeem={voteToRedeem}
            redeemOneVoteModalVisible={redeemOneVoteModalVisible}
            changeVoteState={this.changeVoteState}
            handleRedeemOneVoteConfirm={this.handleRedeemOneVoteConfirm}
          />

          <DividendModal
            dividendModalVisible={dividendModalVisible}
            changeModalVisible={this.changeModalVisible}
            dividends={dividends}
            handleClaimDividendClick={this.handleClaimDividendClick}
          />

          {/* ===== Test Btn ===== */}
          {/* <button
            // onClick={async () => {
            //   voteStore.setPluginLockModalVisible(
            //     !voteStore.pluginLockModalVisible
            //   );
            //   console.log(
            //     'pluginLockModalVisible',
            //     voteStore.pluginLockModalVisible
            //   );
            //   reaction(
            //     () => voteStore.pluginLockModalVisible,
            //     pluginLockModalVisible =>
            //       this.setState({ pluginLockModalVisible })
            //   );
            // }}
            onClick={() =>
              this.changeModalVisible('pluginLockModalVisible', true)
            }
          >
            pluginLockModalVisible
          </button>
          <button
            onClick={() =>
              this.setState({
                pluginLockModalVisible: true
              })
            }
          >
            show plugin lock modal
          </button>

          <button
            onClick={() => {
              const voteConfirmForm = generateVoteConfirmForm.call(this, {
                need: ['voteAmount', 'lockTime']
              });
              this.setState({
                voteConfirmForm,
                voteConfirmModalVisible: true
              });
            }}
          >
            show vote confirm modal
          </button>

          <button
            onClick={() => {
              const voteRedeemForm = generateVoteRedeemForm({});
              this.setState({
                voteRedeemForm,
                voteRedeemModalVisible: true
              });
            }}
          >
            show vote redeem modal
          </button> */}
          {/* ===== Test Btn ===== */}
        </section>
      </Provider>
    );
  }
}

export default withRouter(VoteContainer);
