import React, { PureComponent } from "react";
import { Modal, Form } from "antd";

import { NEED_PLUGIN_AUTHORIZE_TIP } from "@src/constants";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

class RedeemAnVoteModal extends PureComponent {
  generateVoteAnRedeemForm() {
    const { voteToRedeem } = this.props;

    return {
      formItems: [
        {
          label: "Node Name",
          render: (
            <span className="form-item-value">{voteToRedeem.nodeName}</span>
          ),
        },
        {
          label: "Node Add",
          render: (
            <span className="form-item-value">{voteToRedeem.nodeAddress}</span>
          ),
        },
        {
          label: "Redeem Amount",
          render: (
            <span className="form-item-value">{voteToRedeem.amount}</span>
          ),
        },
      ],
    };
  }

  render() {
    const {
      redeemOneVoteModalVisible,
      changeVoteState,
      handleRedeemOneVoteConfirm,
    } = this.props;
    const voteAnRedeemForm = this.generateVoteAnRedeemForm();
    return (
      <Modal
        className="vote-redeem-modal"
        title="Redeem The Vote"
        visible={redeemOneVoteModalVisible}
        onOk={handleRedeemOneVoteConfirm}
        onCancel={() => {
          changeVoteState({
            redeemOneVoteModalVisible: false,
          });
        }}
        width={860}
        centered
        maskClosable
        keyboard
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          {voteAnRedeemForm.formItems &&
            voteAnRedeemForm.formItems.map((item) => (
              <Form.Item label={item.label} key={item.label}>
                {item.render}
              </Form.Item>
            ))}
        </Form>
        <p className="tip-color" style={{ marginTop: 10 }}>
          {NEED_PLUGIN_AUTHORIZE_TIP}
        </p>
      </Modal>
    );
  }
}

export default RedeemAnVoteModal;
