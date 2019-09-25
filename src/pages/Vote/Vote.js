/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:47:40
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-25 16:01:39
 * @Description: pages for vote & election
 */
import React, { Component } from 'react';
import { Tabs, Modal, Form, Input, Button, message } from 'antd';
import { Switch, Route, Link } from 'react-router-dom';
import { toJS, reaction } from 'mobx';
import { Provider } from 'mobx-react';
import moment from 'moment';

import './Vote.style.less';
import NightElfCheck from '@utils/NightElfCheck';
import checkPermissionRepeat from '@utils/checkPermissionRepeat';
import getLogin from '@utils/getLogin';
import { thousandsCommaWithDecimal } from '@utils/formater';
import getContractAddress from '@utils/getContractAddress';
import DownloadPlugins from '@components/DownloadPlugins/DownloadPlugins';
// import NumericInput from '@components/NumericInput';
import { DEFAUTRPCSERVER as DEFAUT_RPC_SERVER, APPNAME } from '@config/config';
import { aelf } from '@src/utils';
// import voteStore from '@store/vote';
import contractsStore from '@store/contracts';
import MyVote from './MyVote/MyVote';
import ElectionNotification from './ElectionNotification/ElectionNotification';
import CandidateApply from './CandidateApply';
import KeyInTeamInfo from './KeyInTeamInfo';
import TeamDetail from './TeamDetail';
import VoteModal from './VoteModal';
import DividendModal from './DividendModal';
import { contractsNeedToLoad } from './constants';
import { SYMBOL, TOKEN_CONTRACT_DECIMAL } from '@src/constants';
import getStateJudgment from '@utils/getStateJudgment';
import { electionContractAddr } from '@config/config';
import getCurrentWallet from '@utils/getCurrentWallet';
import { getAllTeamDesc } from '@api/vote';
import {
  FROM_WALLET,
  FROM_EXPIRED_VOTES,
  FROM_ACTIVE_VOTES,
  NODE_DEFAULT_NAME
} from '@src/pages/Vote/constants';

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
  const { nodeAddress, nodeName, switchVoteAmount } = this.state;

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
            {this.state.voteAmountInput} {SYMBOL}
          </span>
        )
      },
      {
        type: 'lockTime',
        label: '锁定期',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {this.state.lockTime.format('MMMM Do YYYY')}{' '}
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
        label: '预估投票收益',
        render: (
          <div>
            <Input />
            <span className='tip-color' style={{ marginLeft: 10 }}>
              投票收益=(锁定期*票数/总票数)*分红池奖励*20%
            </span>
          </div>
        )
      }
    ]
  };

  need.forEach(item => {
    res.formItems.push(
      materials.formItems.find(oneType => oneType.type === item)
    );
  });

  return res;
}

function generateVoteRedeemForm({
  nodeAddress,
  currentWalletName,
  currentWalletBalance
}) {
  return {
    formItems: [
      {
        label: '节点名称',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            Node Name
          </span>
        )
      },
      {
        label: '地址',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {123}
          </span>
        )
      },
      {
        label: '当前投票总数',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {100} {SYMBOL}
          </span>
        )
      },
      {
        label: '过期票数',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {30} {SYMBOL}
          </span>
        )
      },
      {
        label: '赎回数量',
        render: (
          <div>
            <Input
              suffix={SYMBOL}
              placeholder='Enter vote amount'
              style={{ marginRight: 20 }}
            />
            <Button type='primary'>Redeem All</Button>
          </div>
        )
      },
      {
        label: '赎回至',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            钱包A
          </span>
        )
      }
    ]
  };
}

class VoteContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: null,
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
      switchVoteAmount: 0,
      voteType: FROM_WALLET,
      switchVoteSelectedRowKeys: []
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.voteNextCallback = this.voteNextCallback.bind(this);
    // this.handleAllIn = this.handleAllIn.bind(this);
    this.handleVoteAmountChange = this.handleVoteAmountChange.bind(this);
    this.handleLockTimeChange = this.handleLockTimeChange.bind(this);
    this.handleVoteConfirmOk = this.handleVoteConfirmOk.bind(this);
    this.handleVoteTypeChange = this.handleVoteTypeChange.bind(this);
    this.handleSwithVoteSelectedRowChange = this.handleSwithVoteSelectedRowChange.bind(
      this
    );
    this.handleRedeemConfirm = this.handleRedeemConfirm.bind(this);

    this.formGroup = null;
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
      // message.error(e);
      console.error(e);
    }
    this.getExtensionKeypairList();
  }

  // handleAllIn() {
  //   const { balance } = this.state;

  //   this.setState({
  //     voteAmountInput: balance
  //   });
  // }

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
    aelf.chain.contractAt(
      result[contractAddrValName],
      result.wallet,
      (error, contract) => {
        if (error) {
          console.error(error);
        }

        contractsStore.setContract(contractNickname, contract);
        this.setState({ [contractNickname]: contractsStore[contractNickname] });
        if (contractNickname === 'consensusContract') {
          this.chainInfo = contract;
          // todo: We shouldn't get vote info by consensus contract
          // this.getInformation(result);
        }

        if (contractNickname === 'electionContract') {
          this.judgeIsCandidate();
        }
      }
    );
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
            nightElf.chain.getChainStatus((error, result) => {
              if (result) {
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
    let { switchVoteAmount } = this.state;
    switchVoteAmount = selectedRows.reduce(
      (total, current) => total + +current.amount,
      0
    );
    this.setState({
      switchVoteSelectedRowKeys: selectedRowKeys,
      switchVoteAmount
    });
  }

  handleVoteAmountChange(value) {
    this.setState({
      voteAmountInput: value
    });
  }

  insertKeypairs(result) {
    const { nightElf } = this.state;
    const getLoginPayload = {
      appName: APPNAME,
      connectChain: this.connectChain
    };
    console.log('APPNAME', APPNAME);
    if (result && result.error === 0) {
      const { permissions } = result;
      const payload = {
        appName: APPNAME,
        connectChain: this.connectChain,
        result
      };
      // localStorage.setItem('currentWallet', null);
      getLogin(nightElf, getLoginPayload, result => {
        if (result && result.error === 0) {
          console.log('result', result);
          const wallet = JSON.parse(result.detail);
          if (permissions.length) {
            // EXPLAIN: Need to redefine this scope
            checkPermissionRepeat(nightElf, payload, () => {
              this.getNightElfKeypair(wallet);
            });
          } else {
            this.getNightElfKeypair(wallet);
            message.success('Login success!!', 3);
          }
        } else {
          this.setState({
            showWallet: false
          });
          console.log('result.errorMessage', result.errorMessage);
          message.error(result.errorMessage.message, 3);
        }
      });
    } else {
      if (result.error === 200005) {
        this.showModal('pluginLockModalVisible');
      }
      // message.error(result.errorMessage.message, 3);
    }
  }

  showModal(visible) {
    this.setState({
      [visible]: true
    });
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
    const { nodeAddress: interestingNodePublicKey } = this.state;
    const electorVote = resArr[0];
    let allTeamInfo = null;
    if (resArr[1].code === 0) {
      allTeamInfo = resArr[1].data;
    }
    const {
      activeVotingRecords,
      allVotedVotesAmount,
      activeVotedVotesAmount
    } = electorVote;
    const expiredVotesAmount = allVotedVotesAmount - activeVotedVotesAmount;
    const switchableVoteRecords = activeVotingRecords.filter(
      record => record.candidate !== interestingNodePublicKey
    );

    switchableVoteRecords.forEach(record => {
      const { voteTimestamp, lockTime } = record;
      const teamInfo = allTeamInfo.find(
        team => team.public_key === record.candidate
      );
      console.log('teamInfo', teamInfo);
      if (teamInfo === undefined) {
        record.name = NODE_DEFAULT_NAME;
      } else {
        record.name = teamInfo.name;
      }
      // Antd's Table's datasource needs key
      record.key = record.voteId.value;

      // todo: unify lock time & vote time's handler
      // todo: fix the lock time
      record.formatedLockTime = `${(lockTime / 24 / 60 / 60).toFixed(1)} Days`;
      record.formatedVoteTime = moment()
        .set('second', voteTimestamp.seconds)
        .format('YYYY-MM-DD');
    });
    this.setState({
      expiredVotesAmount,
      activeVotingRecords,
      switchableVoteRecords
    });
  }

  judgeIsCandidate() {
    const { electionContract } = this.state;
    const currentWallet = getCurrentWallet();

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
    if(!ele.dataset.role) return;
    // To make sure that all the operation use wallet take effects on the correct wallet
    // It can only be lower case
    const { shoulddetectlock, votetype } = ele.dataset;
    if (shoulddetectlock) {
      this.getExtensionKeypairList();
    }

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
        this.handleRedeemClick();
        break;
      default:
        break;
    }
  }

  handleVoteClick(ele) {
    this.getWalletBalance()
      .then(res => {
        // todo: unify balance formater: InputNumber's and thousandsCommaWithDecimal's
        const balance = +res.balance / TOKEN_CONTRACT_DECIMAL;
        const formatedBalance = thousandsCommaWithDecimal(balance);
        this.fetchDataVoteNeed();

        this.setState({
          balance,
          nodeAddress: ele.dataset.nodeaddress,
          currentWalletName: JSON.parse(localStorage.getItem('currentWallet'))
            .name,
          formatedBalance,
          nodeName: ele.dataset.nodename || ''
        });
        this.showModal('voteModalVisible');
      })
      .then(() => {
        this.showModal('voteModalVisible');
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleRedeemClick() {
    this.showModal('voteRedeemModalVisible');
  }

  handleRedeemConfirm() {
    // todo: should nightElf place in state?
    const { nightElf } = this.state;

    const currentWallet = getCurrentWallet();
    const wallet = {
      address: currentWallet.address
    };
    // todo: get the contract from extension in cdm or other suitable time
    // todo: error handle
    nightElf.chain.contractAt(electionContractAddr, wallet, (err, result) => {
      if (result) {
        const electionContractFromExt = result;
        const payload = {
          voteId: 'fBCLjftjlaXXS5IdC8dM1HSVMbA7GnnJ7c6mnWwxcTY='
        };

        // todo: there are the same code here
        electionContractFromExt
          .Withdraw("mWVhEhDb5cryNYhqa8DX1S9hIWoR4jb8Jw8gOwzEdnA=")
          .then(res => {
            const transactionId = res.result
              ? res.result.TransactionId
              : res.TransactionId;
            setTimeout(() => {
              console.log('transactionId', transactionId);
              aelf.chain.getTxResult(transactionId, (error, result) => {
                console.log('result', result);
                getStateJudgment(result.Status, transactionId);
              });
            }, 4000);
          })
          .catch(err => console.error(err));
      }
    });
  }

  voteNextCallback() {
    const { voteType } = this.state;
    let voteConfirmForm = null;
    console.log('voteType', voteType);
    if (voteType === FROM_ACTIVE_VOTES) {
      voteConfirmForm = generateVoteConfirmForm.call(this, {
        need: ['lockTime', 'nodeName', 'nodeAddress', 'switchVoteAmount']
      });
    } else {
      voteConfirmForm = generateVoteConfirmForm.call(this, {
        need: ['voteAmount', 'lockTime']
      });
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
    console.log('value', value);
    // this.setState({
    //   lockTime: value
    // });
    console.log('moment', moment().add(5, 'minutes'))
    // this.setState({
    //   lockTime: moment().add(5, 'minutes')
    // });
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
    const { nightElf, voteType } = this.state;

    const currentWallet = getCurrentWallet();
    const wallet = {
      address: currentWallet.address
    };
    // todo: get the contract from extension in cdm or other suitable time
    // todo: error handle
    nightElf.chain.contractAt(electionContractAddr, wallet, (err, result) => {
      if (result) {
        const electionContractFromExt = result;
        switch (voteType) {
          case FROM_WALLET:
            this.handleVoteFromWallet(electionContractFromExt);
            break;
          case FROM_EXPIRED_VOTES:
            break;
          case FROM_ACTIVE_VOTES:
            this.handleSwitchVote(electionContractFromExt);
            break;
          default:
            break;
        }
      }
    });
  }

  handleVoteFromWallet(electionContractFromExt) {
    const { voteAmountInput, nodeAddress } = this.state;
    // const timeMS = moment(lockTime).getMilliseconds();
    // console.log('ms', timeMS);
    const lockTime =  moment().add(5, 'minutes')
    const payload = {
      candidatePubkey: nodeAddress,
      amount: voteAmountInput,
      // todo: add decimal or not
      // amount: voteAmountInput * TOKEN_CONTRACT_DECIMAL,
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
        const transactionId = res.result
          ? res.result.TransactionId
          : res.TransactionId;
        setTimeout(() => {
          console.log('transactionId', transactionId);
          aelf.chain.getTxResult(transactionId, (error, result) => {
            console.log('result', result);
            getStateJudgment(result.Status, transactionId);
          });
        }, 4000);
      })
      .catch(err => console.error(err));
  }

  // todo: global node address are public key actually
  handleSwitchVote(electionContractFromExt) {
    const { nodeAddress: candidatePubkey } = this.state;
    // todo: limit max change num or handle the concurreny problem
    const { switchVoteSelectedRowKeys } = this.state;
    // switchVoteSelectedRowKeys.forEach(voteId => {
    //   const payload = {
    //     voteId,
    //     candidatePubkey
    //   };
    //   electionContractFromExt
    //     .ChangeVotingOption(payload)
    //     .then(res => {
    //       console.log('ChangeVotingOption', res);
    //     })
    //     .catch(err => {
    //       console.error('ChangeVotingOption', err);
    //     });
    // });
    // switchVoteSelectedRowKeys.forEach(voteId => {
    const payload = {
      voteId: switchVoteSelectedRowKeys[0],
      candidatePubkey
    };
    electionContractFromExt
      .ChangeVotingOption(payload)
      .then(res => {
        console.log('ChangeVotingOption', res);
      })
      .catch(err => {
        console.error('ChangeVotingOption', err);
      });
    // });
  }

  handleVoteTypeChange(voteType) {
    this.setState({
      voteType
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
      voteContract,
      electionContract,
      showDownloadPlugin,
      multiTokenContract,
      profitContract,
      dividendContract,
      consensusContract,
      balance,
      formatedBalance,
      nodeAddress,
      nodeName,
      currentWalletName,
      voteAmountInput,
      lockTime,
      nightElf,
      isCandidate,
      expiredVotesAmount,
      switchableVoteRecords,
      voteType,
      switchVoteSelectedRowKeys
    } = this.state;

    // todo: decouple
    // this.formGroup = generateFormGroup.call(this, { nodeAddress: null });

    return (
      <Provider contractsStore={contractsStore}>
        <section onClick={this.handleClick}>
          {showDownloadPlugin ? (
            <DownloadPlugins style={{ margin: '0 56px' }} />
          ) : null}
          <Tabs defaultActiveKey='1' className='secondary-level-nav'>
            <TabPane
              tab={
                <Link to='/vote' style={{ color: '#fff' }}>
                  Election Notification
                </Link>
              }
              key='electionNotification'
            >
              <Switch>
                <Route
                  exact
                  path='/vote'
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
                    />
                  )}
                  s
                />
                <Route
                  exact
                  path='/vote/apply'
                  electionContract={electionContract}
                  render={() => (
                    <CandidateApply
                      electionContract={electionContract}
                      nightElf={nightElf}
                    />
                  )}
                />
                <Route
                  path='/vote/apply/keyin'
                  render={() => (
                    <KeyInTeamInfo electionContract={electionContract} />
                  )}
                />
                <Route
                  path='/vote/team'
                  render={() => (
                    <TeamDetail
                      consensusContract={consensusContract}
                      electionContract={electionContract}
                    />
                  )}
                />
              </Switch>
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
                  const voteConfirmForm = generateVoteConfirmForm({
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
              </button>
            </TabPane>
            <TabPane tab='My Vote' key='myVote' style={{ color: '#fff' }}>
              <MyVote
                electionContract={electionContract}
                handleVoteTypeChange={this.handleVoteTypeChange}
              />
            </TabPane>
          </Tabs>

          <VoteModal
            voteModalVisible={voteModalVisible}
            formatedBalance={formatedBalance}
            nodeAddress={nodeAddress}
            nodeName={nodeName}
            currentWalletName={currentWalletName}
            balance={balance}
            callback={this.voteNextCallback}
            onCancel={this.handleCancel.bind(this, 'voteModalVisible')}
            handleVoteAmountChange={this.handleVoteAmountChange}
            handleSwitchVoteAmountChange={this.handleSwitchVoteAmountChange}
            handleLockTimeChange={this.handleLockTimeChange}
            voteAmountInput={voteAmountInput}
            lockTime={lockTime}
            expiredVotesAmount={expiredVotesAmount}
            switchableVoteRecords={switchableVoteRecords}
            handleSwitchVote={this.handleSwitchVote}
            handleVoteTypeChange={this.handleVoteTypeChange}
            voteType={voteType}
            handleSwithVoteSelectedRowChange={
              this.handleSwithVoteSelectedRowChange
            }
            switchVoteSelectedRowKeys={switchVoteSelectedRowKeys}
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
            <p style={{ marginTop: 30 }}>该投票请求NightELF授权签名</p>
          </Modal>

          <Modal
            className='vote-redeem-modal'
            title='Vote Redeem'
            visible={voteRedeemModalVisible}
            onOk={this.handleRedeemConfirm}
            onCancel={this.handleCancel.bind(this, 'voteRedeemModalVisible')}
            centered
            maskClosablef
            keyboard
          >
            <Form {...voteConfirmFormItemLayout} onSubmit={this.handleSubmit}>
              {voteRedeemForm.formItems &&
                voteRedeemForm.formItems.map(item => {
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
            <p className='tip-color' style={{ fontSize: 12 }}>
              本次赎回将扣除2ELF的手续费
            </p>
            <p style={{ marginTop: 10 }}>该投票请求NightELF授权签名</p>
          </Modal>


          <DividendModal />

          <button
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
            onClick={() => this.showModal('pluginLockModalVisible')}
          >
            pluginLockModalVisible
          </button>
        </section>
      </Provider>
    );
  }
}

export default VoteContainer;
