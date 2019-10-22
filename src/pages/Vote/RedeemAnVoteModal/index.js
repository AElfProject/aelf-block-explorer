import React, { PureComponent } from 'react';
import { Modal, Form } from 'antd';

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

export class RedeemAnVoteModal extends PureComponent {
  generateVoteAnRedeemForm() {
    const { voteToRedeem, currentWallet } = this.props;

    return {
      formItems: [
        {
          label: '节点名称',
          // todo: use classname isteads of the inline-css
          render: (
            <span
              style={{ color: '#fff', width: 600, display: 'inline-block' }}
            >
              {voteToRedeem.nodeName}
            </span>
          )
        },
        {
          label: '地址',
          render: (
            <span
              style={{ color: '#fff', width: 600, display: 'inline-block' }}
            >
              {voteToRedeem.nodeAddress}
            </span>
          )
        },
        {
          label: '赎回数量',
          render: (
            <span
              style={{ color: '#fff', width: 600, display: 'inline-block' }}
            >
              {voteToRedeem.amount}
            </span>
          )
        },
        {
          label: '赎回至',
          render: (
            <span
              style={{ color: '#fff', width: 600, display: 'inline-block' }}
            >
              {currentWallet && currentWallet.name}
            </span>
          )
        }
      ]
    };
  }

  render() {
    const {
      redeemOneVoteModalVisible,
      changeVoteState,
      handleRedeemOneVoteConfirm
    } = this.props;
    const voteAnRedeemForm = this.generateVoteAnRedeemForm();
    console.log({
      redeemOneVoteModalVisible
    });
    return (
      <Modal
        className='vote-redeem-modal'
        title='Redeem The Vote'
        visible={redeemOneVoteModalVisible}
        onOk={handleRedeemOneVoteConfirm}
        onCancel={() => {
          changeVoteState({
            redeemOneVoteModalVisible: false
          });
        }}
        width={860}
        centered
        maskClosable
        keyboard
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          {voteAnRedeemForm.formItems &&
            voteAnRedeemForm.formItems.map(item => {
              return (
                <Form.Item label={item.label} key={item.label}>
                  {item.render}
                </Form.Item>
              );
            })}
        </Form>
        <p className='tip-color' style={{ fontSize: 12 }}>
          本次赎回将扣除2ELF的手续费
        </p>
        <p style={{ marginTop: 10 }}>该投票请求NightELF授权签名</p>
      </Modal>
    );
  }
}

export default RedeemAnVoteModal;
