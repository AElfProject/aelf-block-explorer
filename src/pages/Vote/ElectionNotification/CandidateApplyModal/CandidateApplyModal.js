/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-12-07 19:00:59
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-09 15:05:34
 * @Description: file content
 */
import React, { PureComponent, forwardRef } from "react";
import AElf from "aelf-sdk";
import { Form, Input, Button, Modal, message, Tooltip, Icon } from "antd";

import { NEED_PLUGIN_AUTHORIZE_TIP, SYMBOL } from "@src/constants";
import {
  ELECTION_MORTGAGE_NUM_STR,
  HARDWARE_ADVICE,
} from "@pages/Vote/constants";
import getCurrentWallet from "@utils/getCurrentWallet";
import "./CandidateApplyModal.style.less";
import addressFormat from "../../../../utils/addressFormat";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const modalFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

function generateCandidateApplyForm() {
  const currentWallet = getCurrentWallet();
  return {
    formItems: [
      {
        label: "Mortgage Add",
        render: (
          <span className='list-item-value'>
            {addressFormat(currentWallet.address)}
          </span>
        ),
      },
      {
        label: "Mortgage Amount",
        render: (
          <span className='list-item-value'>
            {ELECTION_MORTGAGE_NUM_STR} {SYMBOL} &nbsp;&nbsp;&nbsp;
            <Tooltip
              title={`The ${SYMBOL} cannot be redeemed during the time being a BP
              node`}
            >
              <ExclamationCircleOutlined />
            </Tooltip>
          </span>
        ),
      },
      {
        label: "Wallet",
        render: <span className='list-item-value'>{currentWallet.name}</span>,
      },
      {
        label: "Hardware Advice",
        render: (
          // <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
          <span className='list-item-value'>{HARDWARE_ADVICE}</span>
        ),
      },
    ],
  };
}

class CandidateApplyModal extends PureComponent {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
  }

  handleOk() {
    const { onOk } = this.props;
    this.formRef.current
      .validateFields()
      .then((values) => {
        onOk(values.admin.trim());
      })
      .catch((e) => {
        console.error(e);
      });
  }

  render() {
    const { onCancel, visible } = this.props;
    const candidateApplyForm = generateCandidateApplyForm();
    const rules = [
      {
        required: true,
        type: "string",
        message: "Please input your admin address!",
      },
      () => ({
        validator(_, value) {
          try {
            AElf.utils.decodeAddressRep(value.trim());
            return Promise.resolve();
          } catch (e) {
            if (!value) return Promise.resolve();
            return Promise.reject(new Error(`${value} is not a valid address`));
          }
        },
      }),
    ];
    const TooltipInput = forwardRef((props, ref) => {
      return (
        <>
          <Input
            ref={ref}
            {...props}
            placeholder='Please input admin address'
          />
          <Tooltip
            className='candidate-admin-tip'
            title="Admin has the right to replace the candidate's Pubkey and pull the candidate out of the election. Better be the address of an organization which created in Association Contract."
          >
            <ExclamationCircleOutlined />
          </Tooltip>
        </>
      );
    });
    return (
      <Modal
        className='apply-node-modal'
        title='Apply Node'
        visible={visible}
        okText='Apply Now'
        onOk={this.handleOk}
        onCancel={onCancel}
        centered
        maskClosable
        keyboard
        width={800}
      >
        <Form {...modalFormItemLayout} ref={this.formRef}>
          {candidateApplyForm.formItems &&
            candidateApplyForm.formItems.map((item) => {
              return (
                <Form.Item label={item.label} key={item.label}>
                  {item.render ? item.render : <Input />}
                </Form.Item>
              );
            })}
          <Form.Item
            label='Candidate Admin:'
            className='candidate-admin'
            name='admin'
            rules={rules}
          >
            <TooltipInput></TooltipInput>
          </Form.Item>
        </Form>
        <p className='tip-color' style={{ marginTop: 10 }}>
          {NEED_PLUGIN_AUTHORIZE_TIP}
        </p>
      </Modal>
    );
  }
}

export default CandidateApplyModal;
