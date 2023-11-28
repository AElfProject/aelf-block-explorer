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
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Tooltip } from "antd";
import { RUN_INDIVIDUAL_NODES_TIP, SYMBOL } from "@src/constants";
import {
  ELECTION_MORTGAGE_NUM_STR,
  MINIMUN_HARDWARE_ADVICE,
  HARDWARE_ADVICE,
  MINIMUN_HARDWARE_ADVICE_TEST,
  HARDWARE_ADVICE_TEST,
} from "@pages/Vote/constants";
import { NETWORK_TYPE } from "@config/config";
import { connect } from "react-redux";
import "./CandidateApplyModal.style.less";
import addressFormat from "../../../../utils/addressFormat";
import IconFont from "../../../../components/IconFont";

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
              title={`You cannot redeem the staked ${SYMBOL} until you quit the election and your last term ends.`}
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        ),
      },
      {
        label: "Minimum Configuration",
        render: (
          <>
            {handleStrToArr(
              NETWORK_TYPE === "MAIN"
                ? MINIMUN_HARDWARE_ADVICE
                : MINIMUN_HARDWARE_ADVICE_TEST
            ).map((ele) => {
              return <div className="list-item-value">- {ele}</div>;
            })}
          </>
        ),
      },
      {
        label: "Recommended Configuration",
        render: (
          <>
            {handleStrToArr(
              NETWORK_TYPE === "MAIN" ? HARDWARE_ADVICE : HARDWARE_ADVICE_TEST
            ).map((ele) => {
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
            title="Admin account has the right to replace candidate node's public key, set/change the reward receiving address, and quit the node election. If you are running a node yourself, you can set your own node address as the admin. If you are operating a node on other's behalf, please decide whether you need to assign this role to some other addresses."
          >
            <QuestionCircleOutlined />
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
        <Form ref={this.formRef}>
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
          <IconFont type="circle-warning" />
          <strong>Important Notice:</strong>
          <span className="notice-text">
            <div>{RUN_INDIVIDUAL_NODES_TIP}</div>
            {/* {NETWORK_TYPE === "MAIN" ? (
            <>
              <strong>Important Notice:</strong> <div>{RUN_INDIVIDUAL_NODES_TIP}</div>
            </>
          ) : null} */}
            <div>
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
          </span>
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
