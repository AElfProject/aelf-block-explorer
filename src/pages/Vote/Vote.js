/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:47:40
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-16 04:04:20
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
  message
} from 'antd';
import moment from 'moment';

import './Vote.style.less';
import NightElfCheck from '@utils/NightElfCheck';
import checkPermissionRepeat from '@utils/checkPermissionRepeat';
import getLogin from '@utils/getLogin';
import getContractAddress from '@utils/getContractAddress';
import { DEFAUTRPCSERVER as DEFAUT_RPC_SERVER, APP_NAME } from '@config/config';
import { aelf } from '@src/utils';
import MyVote from './MyVote/MyVote';
import ElectionNotification from './ElectionNotification/ElectionNotification';
import { contractsNeedToLoad } from './constants/constants';

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
let formGroup = generateFormGroup({ nodeAddress: null });

class VoteContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: null,
      nightElf: null,

      visible: false,
      voteFrom: 1,
      currentWallet: null,
      consensusContract: null,
      dividendContract: null,
      multiTokenContract: null,
      voteContract: null,
      electionContract: null
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTabsChange = this.handleTabsChange.bind(this);
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

  async getContractAddrByName() {
    const { GenesisContractAddress } = await aelf.chain.getChainStatus();
    const genesisContract = await aelf.chain.contractAt(
      GenesisContractAddress,
      wallet
    );
    const address = await genesisContract.GetContractAddressByName.call(
      AElf.utils.sha256(contractAddress)
    );
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
    aelf.chain.contractAt(
      result[contractAddrValName],
      result.wallet,
      (error, contract) => {
        console.log(contractNickname, contract);
        console.log('test', {
          [contractNickname]: contract
        });
        this.setState(
          {
            [contractNickname]: contract
          },
          () => {
            if (contractNickname === 'electionContract') {
              // this.fetchTotalVotesAmount();
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
        // this.setState({
        //   showDownloadPlugins: true
        // });
      });
  }

  getNightElfKeypair(wallet) {
    if (wallet) {
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

  showModal() {
    this.setState({
      visible: true
    });
  }

  handleOk() {
    // this.setState({
    //   // ModalText: 'The modal will be closed after two seconds',
    //   // confirmLoading: true,
    // });
    setTimeout(() => {
      this.setState({
        visible: false
        // confirmLoading: false,
      });
    }, 2000);
  }

  handleCancel() {
    console.log('Clicked cancel button');
    this.setState({
      visible: false
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
    if (/vote-btn/.test(ele.className)) {
      this.getWalletBalance()
        .then(res => {
          formGroup = generateFormGroup({
            nodeAddress: ele.dataset.nodeaddress,
            currentWalletName: JSON.parse(localStorage.getItem('currentWallet'))
              .name,
            currentWalletBalance: res.balance
          });
          this.showModal();
          // this.setState({
          //   balance: res.balance
          // });
        })
        .catch(err => {});
    }
  }

  handleTabsChange(key) {
    this.setState({
      voteFrom: key
    });
  }

  render() {
    const {
      visible,
      voteFrom,
      tokenContract,
      voteContract,
      electionContract
    } = this.state;

    // const { getFieldDecorator } = this.props.form;

    return (
      <section onClick={this.handleClick}>
        <Tabs defaultActiveKey='1' className='secondary-level-nav'>
          <TabPane tab='节点公示' key='1'>
            <ElectionNotification
              tokenContract={tokenContract}
              voteContract={voteContract}
              electionContract={electionContract}
            />
          </TabPane>
          <TabPane tab='我的投票' key='2'>
            <MyVote />
          </TabPane>
        </Tabs>

        <Modal
          title='节点投票'
          visible={visible}
          onOk={this.handleOk}
          // confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          width={860}
          okText='Next'
          // centered
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
      </section>
    );
  }
}

export default VoteContainer;
