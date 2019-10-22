/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-16 16:44:14
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-22 19:17:19
 * @Description: page for candidate apply
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Modal, message } from 'antd';

import './index.less';
import getCurrentWallet from '@utils/getCurrentWallet';
import { NEED_PLUGIN_AUTHORIZE_TIP } from '@src/constants';
import {
  ELECTION_MORTGAGE_NUM_STR,
  HARDWARE_ADVICE
} from '@pages/Vote/constants';
import { SYMBOL } from '@src/constants';
import { aelf } from '@src/utils';
import getStateJudgment from '@utils/getStateJudgment';
import { electionContractAddr } from '@config/config';

const currentWallet = getCurrentWallet();

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

function generateCandidateApplyForm({
  nodeAddress,
  currentWalletName,
  currentWalletBalance
}) {
  return {
    formItems: [
      {
        label: '抵押地址',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {currentWallet.address}
          </span>
        )
      },
      {
        label: '抵押数量',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {ELECTION_MORTGAGE_NUM_STR} {SYMBOL}
          </span>
        )
      },
      {
        label: '钱包',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {currentWallet.name}
          </span>
        )
      },
      {
        label: '硬件建议',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {HARDWARE_ADVICE}
          </span>
        )
      }
    ]
  };
}

function generateApplyConfirmForm({
  nodeAddress,
  currentWalletName,
  currentWalletBalance
}) {
  return {
    formItems: [
      {
        label: '抵押数量',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {ELECTION_MORTGAGE_NUM_STR}{' '}
            <span className='tip-color'>成为BP节点后该ELF不能提取</span>
          </span>
        )
      },
      {
        label: '钱包',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            {currentWallet.name}
          </span>
        )
      }
    ]
  };
}

const candidateApplyForm = generateCandidateApplyForm({});
const applyConfirmForm = generateApplyConfirmForm({});

const clsPrefix = 'candidate-apply';

class CandidateApply extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      applyConfirmVisible: false
    };

    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleOk() {
    const { nightElf } = this.props;
    const currentWallet = getCurrentWallet();
    const wallet = {
      address: currentWallet.address
    };
    // todo: there are the same code in Vote.js
    // todo: error handle
    nightElf.chain.contractAt(electionContractAddr, wallet, (err, result) => {
      if (result) {
        console.log('result', result);
        const electionContract = result;
        electionContract
          .AnnounceElection()
          .then(res => {
            // todo: handle gloabally, like the way api using
            if (res.error) {
              message.error(res.errorMessage.message);
              return;
            }

            const transactionId = res.result
              ? res.result.TransactionId
              : res.TransactionId;
            // todo: optimize the settimeout
            setTimeout(() => {
              console.log('transactionId', transactionId);
              aelf.chain.getTxResult(transactionId, (error, result) => {
                console.log('result', result);
                const { Status: status } = result;
                getStateJudgment(status, transactionId);
                this.setState({
                  applyConfirmVisible: false
                });
                // todo: handle the other status case
                if (status === 'Mined') {
                  this.props.history.push('/vote/apply/keyin');
                }
              });
            }, 4000);
          })
          .catch(err => {
            console.error(err);
          });
      }
    });

    // this.setState({
    //   applyConfirmVisible: false
    // })
  }

  handleCancel() {
    this.setState({
      applyConfirmVisible: false
    });
  }

  showModal() {
    this.setState({
      applyConfirmVisible: true
    });
  }

  handleBack() {
    this.props.history.goBack();
  }

  render() {
    const { applyConfirmVisible } = this.state;

    return (
      <section
        className={`${clsPrefix}-container card-container page-container`}
      >
        <h3 className={`${clsPrefix}-title`}>申请节点</h3>
        <Form
          className={`${clsPrefix}-form`}
          {...formItemLayout}
          onSubmit={this.handleSubmit}
        >
          {candidateApplyForm.formItems &&
            candidateApplyForm.formItems.map(item => {
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
        <div className={`${clsPrefix}-footer`}>
          <Button onClick={this.handleBack}>Cancel</Button>
          <Button type='primary' onClick={this.showModal}>
            Apply Now
          </Button>
        </div>
        <Modal
          className='apply-confirm-modal'
          title='Apply Confirm'
          visible={applyConfirmVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered
          maskClosable
          keyboard
        >
          <Form {...formItemLayout}>
            {applyConfirmForm.formItems &&
              applyConfirmForm.formItems.map(item => {
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
          <p className='tip-color' style={{ marginTop: 10 }}>
            {NEED_PLUGIN_AUTHORIZE_TIP}
          </p>
        </Modal>
      </section>
    );
  }
}

export default withRouter(CandidateApply);
