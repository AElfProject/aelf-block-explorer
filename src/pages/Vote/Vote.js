/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:47:40
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-20 16:49:30
 * @Description: pages for vote & election
 */
import React, { Component } from 'react';
import {
  Tabs,
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Table,
  message,
  Row,
  Col
} from 'antd';
import moment from 'moment';
import { Switch, Route, Link } from 'react-router-dom';
import { toJS, reaction } from 'mobx';
import { Provider } from 'mobx-react';

import './Vote.style.less';
import NightElfCheck from '@utils/NightElfCheck';
import checkPermissionRepeat from '@utils/checkPermissionRepeat';
import getLogin from '@utils/getLogin';
import { thousandsCommaWithDecimal } from '@utils/formater';
import getContractAddress from '@utils/getContractAddress';
import DownloadPlugins from '@components/DownloadPlugins/DownloadPlugins';
import { DEFAUTRPCSERVER as DEFAUT_RPC_SERVER, APP_NAME } from '@config/config';
import { aelf } from '@src/utils';
import voteStore from '@store/vote';
import contractsStore from '@store/contracts';
import MyVote from './MyVote/MyVote';
import ElectionNotification from './ElectionNotification/ElectionNotification';
import CandidateApply from './CandidateApply';
import KeyInTeamInfo from './KeyInTeamInfo';
import TeamDetail from './TeamDetail';
import { contractsNeedToLoad, TOKEN_CONTRACT_DECIMAL } from './constants';

const { TabPane } = Tabs;
const { Search } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

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

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  }
];

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

function generateFormGroup({
  nodeAddress,
  currentWalletName,
  currentWalletBalance
}) {
  return [
    {
      type: '从钱包投',
      formItems: [
        {
          label: '节点名称'
        },
        {
          label: '地址',
          render: (
            <span
              style={{ color: '#fff', width: 600, display: 'inline-block' }}
            >
              {nodeAddress}
            </span>
          )
        },
        {
          label: '钱包',
          render: (
            <span
              style={{ color: '#fff', width: 600, display: 'inline-block' }}
            >
              {currentWalletName}
            </span>
          )
        },
        {
          label: '可用票数',
          render: (
            <span
              style={{ color: '#fff', width: 600, display: 'inline-block' }}
            >
              {currentWalletBalance} ELF
            </span>
          )
        },
        {
          label: '投票数量',
          render: (
            <div>
              <Input
                suffix='ELF'
                placeholder='Enter vote amount'
                style={{ marginRight: 20 }}
              />
              <Button type='primary'>All In</Button>
            </div>
          )
        },
        {
          label: '锁定期',
          render: (
            <div>
              <DatePicker disabledDate={disabledDate} />
              <span className='tip-color' style={{ marginLeft: 10 }}>
                锁定期内不支持提币和转账
              </span>
            </div>
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
    },
    {
      type: '从过期投票转投',
      formItems: [
        {
          label: '节点名称'
        },
        {
          label: '地址',
          render: (
            <span
              style={{ color: '#fff', width: 600, display: 'inline-block' }}
            >
              {nodeAddress}
            </span>
          )
        },
        {
          label: '过期票数'
        },
        {
          label: '投票数量',
          render: (
            <div>
              <Input
                suffix='ELF'
                placeholder='Enter vote amount'
                style={{ marginRight: 20 }}
              />
              <Button type='primary'>All In</Button>
            </div>
          )
        },
        {
          label: '锁定期',
          render: (
            <div>
              <DatePicker disabledDate={disabledDate} />
              <span className='tip-color' style={{ marginLeft: 10 }}>
                锁定期内不支持提币和转账
              </span>
            </div>
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
    },
    {
      type: '从未过期投票转投',
      formItems: [
        {
          label: '节点名称'
        },
        {
          label: '地址',
          render: (
            <span
              style={{ color: '#fff', width: 600, display: 'inline-block' }}
            >
              {nodeAddress}
            </span>
          )
        },
        {
          label: '投票记录选择',
          render: (
            <div>
              <Search
                placeholder='Input Node Name'
                onSearch={value => console.log(value)}
                style={{ width: 200 }}
              />
              <Table dataSource={dataSource} columns={columns} />
            </div>
          )
        }
      ]
    }
  ];
}

function generateVoteConfirmForm({
  nodeAddress,
  currentWalletName,
  currentWalletBalance,
  need
}) {
  const res = { formItems: [] };
  const materials = {
    title: '从未过期投票转投',
    formItems: [
      {
        label: '所选节点名称'
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
        label: '可用票数',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {123} ELF
          </span>
        )
      },
      {
        label: '投票时间',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {123} ELF
          </span>
        )
      },
      {
        type: 'voteAmount',
        label: '投票数量',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {'...'} ELF
          </span>
        )
      },
      {
        type: 'lockTime',
        label: '锁定期',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {'...'} <span className='tip-color'>锁定期内不支持提币和转账</span>
          </span>
        )
      },
      {
        label: '转投数量',
        render: (
          <div>
            <Input
              suffix='ELF'
              placeholder='Enter vote amount'
              style={{ marginRight: 20 }}
            />
            <Button type='primary'>All In</Button>
          </div>
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
            {100} ELF
          </span>
        )
      },
      {
        label: '过期票数',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {30} ELF
          </span>
        )
      },
      {
        label: '赎回数量',
        render: (
          <div>
            <Input
              suffix='ELF'
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

let formGroup = generateFormGroup({ nodeAddress: null });

class VoteContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: null,
      nightElf: null,

      voteModalVisible: false,
      pluginLockModalVisible: voteStore.pluginLockModalVisible,
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
      showDownloadPlugin: false
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTabsChange = this.handleTabsChange.bind(this);
    this.handleVoteNext = this.handleVoteNext.bind(this);
  }

  async componentDidMount() {
    console.log(this.state);
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

  getWalletBalance() {
    const { currentWallet, multiTokenContract } = this.state;
    console.log('this.state', this.state);
    return multiTokenContract.GetBalance.call({
      symbol: 'ELF',
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
    console.log('result[contractAddrValName]', result[contractAddrValName])
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
            APP_NAME // TODO: 这个需要content.js 主动获取
          });
          if (nightElf) {
            this.setState({
              nightElf
            });
            nightElf.chain.getChainStatus((error, result) => {
              if (result) {
                nightElf.checkPermission(
                  {
                    APP_NAME,
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

  insertKeypairs(result) {
    const { nightElf } = this.state;
    const getLoginPayload = {
      APP_NAME,
      connectChain: this.connectChain
    };
    if (result && result.error === 0) {
      const { permissions } = result;
      const payload = {
        APP_NAME,
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
          message.error(result.errorMessage.message, 3);
        }
      });
    } else {
      message.error(result.errorMessage.message, 3);
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

  fetchElectorVote() {
    const { electionContract } = this.state;
    electionContract.GetElectorVote.call({
      value: 'd238ba4287159b1a55f01a362cbd965f433582cd49166ea0917a9820e81845df'
    })
      .then(res => {
        console.log('GetElectorVote', res);
      })
      .catch(err => {
        console.log('GetElectorVote', err);
      });
  }

  handleClick(e) {
    const ele = e.target;
    switch (ele.dataset.role) {
      case 'vote':
        this.getWalletBalance()
          .then(res => {
            const balance = thousandsCommaWithDecimal(
              +res.balance / TOKEN_CONTRACT_DECIMAL
            );
            formGroup = generateFormGroup({
              nodeAddress: ele.dataset.nodeaddress,
              currentWalletName: JSON.parse(
                localStorage.getItem('currentWallet')
              ).name,
              currentWalletBalance: balance
            });
            this.showModal('voteModalVisible');
            // this.setState({
            //   balance: res.balance
            // });
          })
          .then(() => {
            this.showModal('voteModalVisible');
          })
          .catch(err => {
            console.log(err);
          });

        break;
      case 'redeem':
        this.showModal('voteRedeemModalVisible');
        break;
      default:
        break;
    }
  }

  handleTabsChange(key) {
    this.setState({
      voteFrom: key
    });
  }

  handleVoteNext() {
    this.setState(
      {
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

  togglePluginLockModal(flag) {
    console.log('<<<<', flag);
    voteStore.setPluginLockModalVisible(flag);
    reaction(
      () => voteStore.pluginLockModalVisible,
      pluginLockModalVisible => this.setState({ pluginLockModalVisible })
    );
  }

  render() {
    const {
      voteModalVisible,
      pluginLockModalVisible,
      voteConfirmModalVisible,
      voteRedeemModalVisible,
      voteConfirmForm,
      voteRedeemForm,
      voteFrom,
      tokenContract,
      voteContract,
      electionContract,
      showDownloadPlugin,
      multiTokenContract,
      profitContract,
      dividendContract,
      consensusContract
    } = this.state;


    return (
      <Provider contractsStore={contractsStore}>
        <section onClick={this.handleClick}>
          {showDownloadPlugin ? (
            <DownloadPlugins style={{ margin: '0 56px' }} />
          ) : null}
          <Tabs defaultActiveKey='1' className='secondary-level-nav'>
            <TabPane
              tab={<Link to='/vote'>Election Notification</Link>}
              key='1'
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
                    />
                  )}
                />
                <Route
                  exact
                  path='/vote/apply'
                  electionContract={electionContract}
                  render={() => (
                    <CandidateApply electionContract={electionContract} />
                  )}
                />
                <Route
                  path='/vote/apply/keyin'
                  render={() => (
                    <KeyInTeamInfo electionContract={electionContract} />
                  )}
                />
                <Route path='/vote/team' component={TeamDetail} />
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
            <TabPane tab='我的投票' key='2'>
              <MyVote />
            </TabPane>
          </Tabs>

          <Modal
            title='节点投票'
            visible={voteModalVisible}
            onOk={this.handleVoteNext}
            // confirmLoading={confirmLoading}
            onCancel={this.handleCancel.bind(this, 'voteModalVisible')}
            width={860}
            okText='Next'
            centered
            maskClosable
            keyboard
          >
            <Tabs defaultActiveKey='1' onChange={this.handleTabsChange}>
              {formGroup.map((form, index) => {
                return (
                  <TabPane
                    tab={
                      <span>
                        <input
                          type='radio'
                          checked={index + 1 === +voteFrom}
                          value={form.type}
                          style={{ marginRight: 10 }}
                        />
                        <label htmlFor={form.type}>{form.type}</label>
                      </span>
                    }
                    key={index + 1}
                  >
                    {/* <ElectionNotification /> */}
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                      {form.formItems.map(item => {
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
                  </TabPane>
                );
              })}
            </Tabs>
            <p className='tip-color'>本次投票将扣除2ELF的手续费</p>
          </Modal>

          <Modal
            className='plugin-lock-modal'
            visible={pluginLockModalVisible}
            onOk={() => this.togglePluginLockModal(false)}
            // confirmLoading={confirmLoading}
            onCancel={() => this.togglePluginLockModal(false)}
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
            // onOk={this.handleOk.bind(this, 'voteConfirmModalVisible')}
            // confirmLoading={confirmLoading}
            onCancel={this.handleCancel.bind(this, 'voteConfirmModalVisible')}
            width={860}
            centered
            maskClosable
            keyboard
          >
            {/* <Row>
          <Col span={8} className='form-item-label'>
            投票数量
          </Col>
          <Col span={16} className='form-item-value'>
            100 ELF
          </Col>
        </Row>
        <Row>
          <Col span={8} className='form-item-label'>
            锁定期
          </Col>
          <Col span={16} className='form-item-value'>
            3个月
            <span
              className='tip-color'
              style={{ fontSize: 12, marginLeft: 20 }}
            >
              锁定期内不支持提币和转账
            </span>
          </Col>
        </Row> */}

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
            onOk={this.handleOk.bind(this, 'voteRedeemModalVisible')}
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

          <button
            onClick={async () => {
              voteStore.setPluginLockModalVisible(
                !voteStore.pluginLockModalVisible
              );
              console.log(
                'pluginLockModalVisible',
                voteStore.pluginLockModalVisible
              );
              reaction(
                () => voteStore.pluginLockModalVisible,
                pluginLockModalVisible =>
                  this.setState({ pluginLockModalVisible })
              );
            }}
          >
            pluginLockModalVisible
          </button>
        </section>
      </Provider>
    );
  }
}

export default VoteContainer;
