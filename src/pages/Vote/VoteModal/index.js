import React, { Component } from 'react';
import {
  Tabs,
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Table,
  InputNumber
} from 'antd';
import moment from 'moment';

import { SYMBOL } from '@src/constants';
import './index.less';

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

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

function generateFormGroup({
  nodeAddress,
  currentWalletName,
  currentWalletBalance,
  nodeName
}) {
  console.log('this.state.balance', this.state.balance);

  // return
}

// todo: handle balance's decimal
export default class VoteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1'
    };

    this.handleAllIn = this.handleAllIn.bind(this);
    // this.handleVoteAmountChange = this.handleVoteAmountChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleTabsChange = this.handleTabsChange.bind(this);
  }

  handleAllIn() {
    const { balance, handleVoteAmountChange } = this.props;

    handleVoteAmountChange(balance);
  }

  // handleVoteAmountChange(value) {
  //   const { handleVoteAmountChange } = this.props;

  //   this.setState({
  //     voteAmountInput: value
  //   });
  // }

  handleOk() {
    const { callback } = this.props;
    callback();
  }

  handleTabsChange(key) {
    console.log('key', key);
    this.setState({
      activeKey: key
    });
  }

  getFormItems() {
    const {
      balance,
      formatedBalance,
      nodeAddress,
      nodeName,
      currentWalletName,
      // handleVoteNext,
      voteAmountInput,
      lockTime,
      handleVoteAmountChange,
      handleLockTimeChange
    } = this.props;
    return [
      {
        type: '从钱包投',
        index: 0,
        formItems: [
          {
            label: '节点名称',
            render: <span className='form-item-value'>{nodeName}</span>
          },
          {
            label: '地址',
            render: <span className='form-item-value'>{nodeAddress}</span>
          },
          {
            label: '钱包',
            render: (
              <span className='form-item-value'> {currentWalletName}</span>
            )
          },
          {
            label: '可用票数',
            render: (
              <span className='form-item-value'>
                {formatedBalance} {SYMBOL}
              </span>
            )
          },
          {
            label: '投票数量',
            render: (
              <div>
                <InputNumber
                  suffix={SYMBOL}
                  placeholder='Enter vote amount'
                  style={{ marginRight: 20, width: 'auto' }}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  formatter={value =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  min={0}
                  max={balance}
                  value={voteAmountInput}
                  onChange={handleVoteAmountChange}
                />
                <Button type='primary' onClick={this.handleAllIn}>
                  All In
                </Button>
              </div>
            )
          },
          {
            label: '锁定期',
            render: (
              <div>
                <DatePicker
                  disabledDate={disabledDate}
                  value={lockTime}
                  onChange={handleLockTimeChange}
                />
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
                {/* <span>{estimatedProfit}</span> */}
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
        index: 1,
        formItems: [
          {
            label: '节点名称',
            render: <span className='form-item-value'>{nodeName}</span>
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
            // todo: fix the max and others
            render: (
              <div>
                <InputNumber
                  suffix={SYMBOL}
                  placeholder='Enter vote amount'
                  style={{ marginRight: 20, width: 'auto' }}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  formatter={value =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  min={0}
                  max={balance}
                  value={voteAmountInput}
                  onChange={handleVoteAmountChange}
                />
                <Button type='primary' onClick={this.handleAllIn}>
                  All In
                </Button>
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
                {/* <span>{estimatedProfit}</span> */}
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
        index: 2,
        formItems: [
          {
            label: '节点名称',
            render: <span className='form-item-value'>{nodeName}</span>
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
                {/* <Table dataSource={dataSource} columns={columns} /> */}
              </div>
            )
          }
        ]
      }
    ];
  }

  render() {
    const { activeKey } = this.state;
    const { voteModalVisible } = this.props;
    const formItems = this.getFormItems();

    return (
      <Modal
        title='节点投票'
        visible={voteModalVisible}
        onOk={this.handleOk}
        // confirmLoading={confirmLoading}
        width={860}
        okText='Next'
        centered
        maskClosable
        keyboard
        // todo: optimize, can I use ...this.props instead of the code on the top?
        {...this.props}
      >
        <Tabs
          // defaultActiveKey={0}
          // Warning: Antd's tabs' activeKey can only be string type, number type will cause problem
          onChange={this.handleTabsChange}
          activeKey={activeKey}
        >
          {formItems.map((form, index) => {
            const voteFrom = form.type;
            console.log('index', form.index, index);
            console.log('form', form);
            return (
              <TabPane
                tab={
                  <span>
                    <input
                      type='radio'
                      checked={+activeKey === form.index}
                      value={form.type}
                      style={{ marginRight: 10 }}
                    />
                    <label htmlFor={form.type}>{form.type}</label>
                  </span>
                }
                key={`${form.index}`}
              >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                  {form.formItems.map(formItem => {
                    return (
                      <Form.Item label={formItem.label}>
                        {formItem.render}
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
    );
  }
}
