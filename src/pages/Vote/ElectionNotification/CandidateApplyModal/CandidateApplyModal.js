/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-12-07 19:00:59
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-09 15:05:34
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Form, Input, Button, Modal, message, Tooltip, Icon } from 'antd';

import { NEED_PLUGIN_AUTHORIZE_TIP, LOWER_SYMBOL } from '@src/constants';
import {
  ELECTION_MORTGAGE_NUM_STR,
  HARDWARE_ADVICE
} from '@pages/Vote/constants';
import getCurrentWallet from '@utils/getCurrentWallet';
import { centerEllipsis } from '@utils/formater';
import './CandidateApplyModal.style.less';

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

const currentWallet = getCurrentWallet();

function generateCandidateApplyForm() {
  return {
    formItems: [
      {
        label: 'Mortgage Add',
        render: (
          <span className="list-item-value text-ellipsis">
            {currentWallet.address}
          </span>
        )
      },
      {
        label: 'Mortgage Amount',
        render: (
          <span className="list-item-value">
            {ELECTION_MORTGAGE_NUM_STR} {LOWER_SYMBOL} &nbsp;&nbsp;&nbsp;
            <Tooltip
              title={`The ${LOWER_SYMBOL} cannot be redeemed during the time being a BP
              node`}
            >
              <Icon type="exclamation-circle" />
            </Tooltip>
          </span>
        )
      },
      {
        label: 'Wallet',
        render: <span className="list-item-value">{currentWallet.name}</span>
      },
      {
        label: 'Hardware Advice',
        render: (
          // <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
          <span className="list-item-value">{HARDWARE_ADVICE}</span>
        )
      }
    ]
  };
}

const candidateApplyForm = generateCandidateApplyForm({});

export default class CandidateApplyModal extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { onOk, onCancel, visible } = this.props;

    return (
      <Modal
        className="apply-node-modal"
        title="Apply Node"
        visible={visible}
        okText="Apply Now"
        onOk={onOk}
        onCancel={onCancel}
        centered
        maskClosable
        keyboard
        width={800}
      >
        <Form {...modalFormItemLayout}>
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
        <p className="tip-color" style={{ marginTop: 10 }}>
          {NEED_PLUGIN_AUTHORIZE_TIP}
        </p>
      </Modal>
    );
  }
}
