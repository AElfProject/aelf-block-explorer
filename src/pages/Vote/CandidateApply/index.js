/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-16 16:44:14
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-11-06 17:53:54
 * @Description: page for candidate apply
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Modal, message, Tooltip, Icon } from 'antd';

import './index.less';
import getCurrentWallet from '@utils/getCurrentWallet';
import {
  NEED_PLUGIN_AUTHORIZE_TIP,
  txStatusInUpperCase,
  UNKNOWN_ERROR_TIP,
  LONG_NOTIFI_TIME,
  ALREADY_BEEN_CURRENT_CANDIDATE_TIP,
  LOWER_SYMBOL
} from '@src/constants';
import {
  ELECTION_MORTGAGE_NUM_STR,
  HARDWARE_ADVICE
} from '@pages/Vote/constants';
import { aelf } from '@src/utils';
import getStateJudgment from '@utils/getStateJudgment';

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

const modalFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
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
        label: 'Mortgage Add',
        render: <span className='list-item-value'>{currentWallet.address}</span>
      },
      {
        label: 'Mortgage Amount',
        render: (
          <span className='list-item-value'>
            {ELECTION_MORTGAGE_NUM_STR} {LOWER_SYMBOL}
          </span>
        )
      },
      {
        label: 'Wallet',
        render: <span className='list-item-value'>{currentWallet.name}</span>
      },
      {
        label: 'Hardware Advice',
        render: (
          // <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
          <span className='list-item-value'>{HARDWARE_ADVICE}</span>
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
        label: 'Mortgage Amount',
        render: (
          <span className='form-item-value'>
            {ELECTION_MORTGAGE_NUM_STR} &nbsp;&nbsp;&nbsp;
            <Tooltip
              title={`The ${LOWER_SYMBOL} cannot be redeemed during the time being a BP
              node`}
            >
              <Icon type='exclamation-circle' />
            </Tooltip>
          </span>
        )
      },
      {
        label: 'Wallet',
        render: <span className='form-item-value'>{currentWallet.name}</span>
      }
    ]
  };
}

const candidateApplyForm = generateCandidateApplyForm({});
const applyConfirmForm = generateApplyConfirmForm({});

const clsPrefix = 'candidate-apply';

// todo: page off for those who already been candidate
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
    const {
      currentWallet,
      electionContractFromExt,
      checkExtensionLockStatus
    } = this.props;

    // todo: there are the same code in Vote.js
    // todo: error handle
    checkExtensionLockStatus().then(() => {
      electionContractFromExt
        .AnnounceElection()
        .then(res => {
          // todo: handle gloabally, like the way api using
          if (res.error) {
            message.error(res.errorMessage.message);
            return;
          }
          if (!res) {
            message.error(UNKNOWN_ERROR_TIP);
            return;
          }
          const transactionId = res.result
            ? res.result.TransactionId
            : res.TransactionId;
          // todo: optimize the settimeout
          setTimeout(() => {
            console.log('transactionId', transactionId);
            // todo: Extract the code getTxResult in the project
            aelf.chain.getTxResult(transactionId, (error, result) => {
              this.setState({
                applyConfirmVisible: false
              });
              if (error) {
                message.error(
                  `${error.Status}: ${error.Error}`,
                  LONG_NOTIFI_TIME
                );
                message.error(
                  `Transaction Id: ${transactionId}`,
                  LONG_NOTIFI_TIME
                );
                return;
              }
              const { Status: status } = result;
              getStateJudgment(status, transactionId);

              // todo: handle the other status case
              if (status === txStatusInUpperCase.mined) {
                this.props.history.push(
                  `/vote/apply/keyin?pubkey=${currentWallet &&
                    currentWallet.pubkey}`
                );
              }
            });
          }, 4000);
        })
        .catch(err => {
          console.error(err);
        });
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
    const { isCandidate, shouldJudgeIsCurrentCandidate } = this.props;
    const { applyConfirmVisible } = this.state;

    return (
      <section
        className={`${clsPrefix}-container card-container has-mask-on-mobile`}
      >
        <h3 className={`${clsPrefix}-title`}>Apply Node</h3>
        <div className={`${clsPrefix}-body`}>
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
        </div>
        <div className={`${clsPrefix}-footer`}>
          <Button
            className={`${clsPrefix}-footer-cancel-btn`}
            onClick={this.handleBack}
            shape='round'
          >
            Cancel
          </Button>

          {// todo: Optimize the judge way
          // todo: The loading reference shouldJudgeIsCurrentCandidate is no accurate, it don't contain the time judge if the user is current candidate, maybe we need to modify it later.
          isCandidate ? (
            <Tooltip title={ALREADY_BEEN_CURRENT_CANDIDATE_TIP}>
              <Button
                type='primary'
                onClick={this.showModal}
                disabled={isCandidate}
                loading={shouldJudgeIsCurrentCandidate}
                shape='round'
              >
                Apply Now
              </Button>
            </Tooltip>
          ) : (
            <Button
              type='primary'
              onClick={this.showModal}
              disabled={isCandidate}
              loading={shouldJudgeIsCurrentCandidate}
              shape='round'
            >
              Apply Now
            </Button>
          )}
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
          width={640}
        >
          <Form {...modalFormItemLayout}>
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
