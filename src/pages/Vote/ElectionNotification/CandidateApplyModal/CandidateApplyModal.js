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
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Tooltip } from "antd";
import { RUN_INDIVIDUAL_NODES_TIP, SYMBOL } from "@src/constants";
import {
  ELECTION_MORTGAGE_NUM_STR,
  MINIMUN_HARDWARE_ADVICE,
  HARDWARE_ADVICE,
} from "@pages/Vote/constants";
import { NETWORK_TYPE } from "@config/config";
import { connect } from "react-redux";
import "./CandidateApplyModal.style.less";
import addressFormat from "../../../../utils/addressFormat";

const modalFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};

const handleStrToArr = (str) => {
  const arr = str.split(",");
  return arr;
};

function generateCandidateApplyForm(currentWallet) {
  return {
    formItems: [
      {
        label: "Wallet",
        render: (
          <span className="list-item-value">
            {currentWallet?.name || currentWallet?.address}
          </span>
        ),
      },
      {
        label: "Address",
        render: (
          <span className="list-item-value">
            {addressFormat(currentWallet?.address)}
          </span>
        ),
      },
      {
        label: "Required Staking",
        render: (
          <span className="list-item-value">
            {ELECTION_MORTGAGE_NUM_STR} {SYMBOL} &nbsp;
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
        label: "Minimum Configuration",
        render: (
          <>
            {handleStrToArr(MINIMUN_HARDWARE_ADVICE).map((ele) => {
              return <div className="list-item-value">- {ele}</div>;
            })}
          </>
        ),
      },
      {
        label: "Recommended Configuration",
        render: (
          <>
            {handleStrToArr(HARDWARE_ADVICE).map((ele) => {
              return <div className="list-item-value">- {ele}</div>;
            })}
          </>
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
    const { onCancel, visible, currentWallet } = this.props;
    const candidateApplyForm = generateCandidateApplyForm(currentWallet);
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
            placeholder="Please enter admin address"
          />
          <Tooltip
            className="candidate-admin-tip"
            title="Admin has the right to replace the candidate's Pubkey and pull the candidate out of the election. Better be the address of an organization which created in Association Contract."
          >
            <ExclamationCircleOutlined />
          </Tooltip>
        </>
      );
    });
    return (
      <Modal
        className="apply-node-modal"
        destroyOnClose
        title={`Apply to Become a Block Porducer (BP) ${
          NETWORK_TYPE === "MAIN" ? " " : "on the Testnet"
        } `}
        visible={visible}
        okText="Apply Now"
        onOk={this.handleOk}
        onCancel={onCancel}
        centered
        maskClosable
        keyboard
        width={725}
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
            label="Admin account:"
            className="candidate-admin"
            name="admin"
            rules={rules}
          >
            <TooltipInput />
          </Form.Item>
        </Form>
        <p className="tip-color">
          {NETWORK_TYPE === "MAIN" ? (
            <>
              <strong>Important Notice:</strong> {RUN_INDIVIDUAL_NODES_TIP}
            </>
          ) : null}

          <div className={NETWORK_TYPE === "MAIN" && "main-tip"}>
            Please read the{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={
                NETWORK_TYPE === "MAIN"
                  ? "https://docs.aelf.io/en/latest/tutorials/mainnet.html"
                  : "https://docs.aelf.io/en/latest/tutorials/testnet.html"
              }
            >
              dev docs
            </a>{" "}
            for instructions on node deployment.
          </div>
        </p>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const { currentWallet } = state.common;
  return {
    currentWallet,
  };
};

export default connect(mapStateToProps)(CandidateApplyModal);
