/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-16 17:33:33
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-16 19:21:42
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Form, Input, Button, Select } from 'antd';

import PicUpload from './PicUpload';
import './index.less';

const { Option } = Select;

const selectBefore = (
  <Select defaultValue='Http://' style={{ width: 90 }}>
    <Option value='Http://'>Http://</Option>
    <Option value='Https://'>Https://</Option>
  </Select>
);

const TeamInfoFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

function generateTeamInfoKeyInForm({
  nodeAddress,
  currentWalletName,
  currentWalletBalance
}) {
  return {
    formItems: [
      {
        label: 'Node Name'
      },
      {
        label: 'Node Pictures',
        render: <PicUpload />
      },
      {
        label: 'Website',
        render: (
          <Input addonBefore={selectBefore} placeholder='input your website' />
        )
      },
      {
        label: 'Location',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            8核 16GB 5TB 宽带100Mbps
          </span>
        )
      },
      {
        label: 'Email',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            8核 16GB 5TB 宽带100Mbps
          </span>
        )
      },
      {
        label: 'Intro',
        render: (
          <span style={{ color: '#fff', width: 600, display: 'inline-block' }}>
            8核 16GB 5TB 宽带100Mbps
          </span>
        )
      }
    ]
  };
}

const teamInfoKeyInForm = generateTeamInfoKeyInForm({});

const clsPrefix = 'candidate-apply-team-info-key-in';

class CandidateApply extends PureComponent {
  render() {
    return (
      <section
        className={`${clsPrefix}-container card-container page-container`}
      >
        <h3 className={`${clsPrefix}-title`}>申请节点</h3>
        <Form
          className={`${clsPrefix}-form`}
          {...TeamInfoFormItemLayout}
          onSubmit={this.handleSubmit}
        >
          {teamInfoKeyInForm.formItems &&
            teamInfoKeyInForm.formItems.map(item => {
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
