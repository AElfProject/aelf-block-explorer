/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-23 14:07:46
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-26 15:38:59
 * @Description: file content
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
  InputNumber,
  Checkbox
} from 'antd';
import moment from 'moment';

import { SYMBOL } from '@src/constants';
import {
  FROM_WALLET,
  FROM_EXPIRED_VOTES,
  FROM_ACTIVE_VOTES
} from '@src/pages/Vote/constants';
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

function getColumns() {
  // const { checkedGroup } = this.state;

  return [
    // {
    //   title: 'Rank',
    //   dataIndex: 'rank',
    //   key: 'rank'
    // },
    {
      title: 'Node Name',
      dataIndex: 'name',
      key: 'nodeName'
    },
    {
      title: 'Vote Amount',
      dataIndex: 'amount',
      key: 'voteAmount',
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Lock Time',
      dataIndex: 'formatedLockTime',
      key: 'lockTime',
      sorter: (a, b) => a.lockTime - b.lockTime
    },
    {
      title: 'Vote Time',
      dataIndex: 'formatedVoteTime',
      key: 'voteTime',
      sorter: (a, b) => a.voteTimestamp.seconds - b.voteTimestamp.seconds
    }
    // {
    //   key: 'operations',
    //   render: (text, record, index) => (
    //     <div className='operation-group'>
    //       <Checkbox
    //         type='primary'
    //         checked={checkedGroup[index]}
    //         onChange={checked => {
    //           console.log('click checkbox');
    //           this.handleCheckboxChange(checked, index);
    //         }}
    //       />
    //     </div>
    //   )
    // }
  ];
}

// todo: handle balance's decimal
class VoteModal extends Component {
  constructor(props) {
    super(props);

    this.handleAllIn = this.handleAllIn.bind(this);
    // this.handleVoteAmountChange = this.handleVoteAmountChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
    // this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    // this.onSelectChange = this.onSelectChange.bind(this);
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
      handleLockTimeChange,
      expiredVotesAmount,
      switchableVoteRecords,
      estimatedProfit
    } = this.props;
    const {
      switchVoteSelectedRowKeys,
      handleSwithVoteSelectedRowChange
    } = this.props;

    const columns = getColumns();
    const rowSelection = {
      selectedRowKeys: switchVoteSelectedRowKeys,
      onChange: handleSwithVoteSelectedRowChange,
      hideDefaultSelections: true,
      type: 'radio'
    };

    return [
      {
        type: FROM_WALLET,
        label: '从钱包投',
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
          }
          // {
          //   label: '预估投票收益',
          //   render: (
          //     <div>
          //       <span>{estimatedProfit}</span>
          //       <span className='tip-color' style={{ marginLeft: 10 }}>
          //         投票收益=(锁定期*票数/总票数)*分红池奖励*20%
          //       </span>
          //     </div>
          //   )
          // }
        ]
      },
      {
        type: FROM_EXPIRED_VOTES,
        label: '从过期投票转投',
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
            label: '过期票数',
            render: (
              <span className='form-item-value'>{expiredVotesAmount}</span>
            )
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
                  max={expiredVotesAmount}
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
          }
          // {
          //   label: '预估投票收益',
          //   render: (
          //     <div>
          //       <span>{estimatedProfit}</span>
          //       <span className='tip-color' style={{ marginLeft: 10 }}>
          //         投票收益=(锁定期*票数/总票数)*分红池奖励*20%
          //       </span>
          //     </div>
          //   )
          // }
        ]
      },
      {
        type: FROM_ACTIVE_VOTES,
        label: '从未过期投票转投',
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
                <Table
                  dataSource={switchableVoteRecords}
                  columns={columns}
                  rowSelection={rowSelection}
                />
              </div>
            )
          }
          // {
          //   label: '锁定期',
          //   render: (
          //     <div>
          //       <DatePicker
          //         disabledDate={disabledDate}
          //         value={lockTime}
          //         onChange={handleLockTimeChange}
          //       />
          //       <span className='tip-color' style={{ marginLeft: 10 }}>
          //         锁定期内不支持提币和转账
          //       </span>
          //     </div>
          //   ),
          //   // todo: unify the validator form, use rules or Form.Item's
          //   validator: {
          //     rules: [
          //       // todo: add the validator rule
          //       {
          //         required: true,
          //         message: 'Please select your lock time!'
          //       }
          //     ],
          //     validateTrigger: ['onChange', 'onBlur'],
          //     fieldDecoratorid: 'lockTime'
          //   }
          // }
        ]
      }
    ];
  }

  // handleCheckboxChange(checked, index) {
  //   const { switchVoteAmount } = this.props;
  //   const { checkedGroup } = this.state;
  //   checkedGroup[index] = checked;

  //   this.setState(
  //     {
  //       checkedGroup: [...checkedGroup]
  //     },
  //     () => {
  //       switchVoteAmount();
  //     }
  //   );
  // }

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
    const { callback, handleSwitchVote } = this.props;
    const { voteType } = this.props;
    console.log('voteType', voteType);

    switch (voteType) {
      case FROM_WALLET:
        // todo: change name
        callback();
        break;
      case FROM_EXPIRED_VOTES:
        break;
      case FROM_ACTIVE_VOTES:
        callback();
        break;
      default:
        break;
    }
  }

  render() {
    const { voteModalVisible, handleVoteTypeChange, voteType } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItems = this.getFormItems();
    console.log('voteType', voteType);

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
          defaultActiveKey={voteType}
          // Warning: Antd's tabs' activeKey can only be string type, number type will cause problem
          onChange={handleVoteTypeChange}
          activeKey={voteType}
        >
          {formItems.map((form, index) => {
            // console.log('index', form.index, index);
            // console.log('form', form);
            return (
              <TabPane
                tab={
                  <span>
                    <input
                      type='radio'
                      checked={voteType === form.type}
                      value={form.type}
                      style={{ marginRight: 10 }}
                      onChange={() => {}}
                    />
                    <label htmlFor={form.label}>{form.label}</label>
                  </span>
                }
                key={form.type}
              >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                  {form.formItems.map(item => {
                    // todo: there are repeat code in form
                    return (
                      <Form.Item label={item.label} key={item.label}>
                        {/* todo: Optimize the judge */}
                        {item.validator
                          ? getFieldDecorator(
                              item.validator.fieldDecoratorid,
                              item.validator
                            )(item.render || <Input />)
                          : item.render}
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

export default Form.create({})(VoteModal);
