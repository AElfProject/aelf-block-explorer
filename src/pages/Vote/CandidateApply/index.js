/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-16 16:44:14
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-16 17:30:56
 * @Description: page for candidate apply
 */
import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';

import './index.less';

const candidateApplyFormItemLayout = {
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
            2jwEEFkYgi1dvabjmGvVJa67Xfh6vZh82rtzFsbMsiqCjK3sm2
          </span>
        )
      },
      {
        label: '抵押数量',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            100,000 ELF
          </span>
        )
      },
      {
        label: '钱包',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            钱包A
          </span>
        )
      },
      {
        label: '硬件建议',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            8核 16GB 5TB 宽带100Mbps
          </span>
        )
      }
    ]
  };
}

const candidateApplyForm = generateCandidateApplyForm({});

const clsPrefix = 'candidate-apply';

class CandidateApply extends PureComponent {
  render() {
    return (
      <section
        className={`${clsPrefix}-container card-container page-container`}
      >
        <h3 className={`${clsPrefix}-title`}>申请节点</h3>
        <Form
          className={`${clsPrefix}-form`}
          {...candidateApplyFormItemLayout}
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
          <Button>Cancel</Button>
          <Button type='primary'>Apply Now</Button>
        </div>
      </section>
    );
  }
}

export default CandidateApply;
