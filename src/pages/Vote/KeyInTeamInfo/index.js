/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-16 17:33:33
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-17 15:37:19
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Form, Input, Button, Select, Icon } from 'antd';

// import PicUpload from './PicUpload';
import './index.less';

// const reg = /^[.-\w]+$/;
const { Option } = Select;
const { TextArea } = Input;

let id = 1;

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

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 }
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
        label: 'Node Name',
        fieldDecoratorid: 'nodename',
        validator: {
          rules: [
            // todo: add the validator rule
            {
              required: true,
              message: 'Please input your node name!'
            }
          ],
          validateTrigger: ['onChange', 'onBlur']
        },
        placeholder: 'Input your node name:'
      },
      {
        label: 'Node Avatar',
        render: <Input addonBefore='Https://' placeholder='Input avatar url:' />
      },
      {
        label: 'Location',
        placeholder: 'Input your location:'
      },
      {
        label: 'Official Website',
        render: (
          <Input addonBefore='Https://' placeholder='Input your website:' />
        )
      },
      {
        label: 'Email',
        fieldDecoratorid: 'email',
        validator: {
          rules: [
            {
              type: 'email',
              message: 'The input is not valid E-mail!'
            }
          ]
        },
        placeholder: 'Input your email:'
      },
      {
        label: 'Intro',
        render: (
          <TextArea
            placeholder='Intro your team here:'
            autosize={{ minRows: 3, maxRows: 6 }}
          />
        )
      }
    ]
  };
}

const teamInfoKeyInForm = generateTeamInfoKeyInForm({});

const clsPrefix = 'candidate-apply-team-info-key-in';

class CandidateApply extends PureComponent {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(++id);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...TeamInfoFormItemLayout}
        label={
          <Select defaultValue='Github' style={{ width: '60%' }}>
            <Option value='Facebook'>Facebook</Option>
            <Option value='Telegram'>Telegram</Option>
            <Option value='Twitter'>Twitter</Option>
            <Option value='Steemit'>Steemit</Option>
            <Option value='Github'>Github</Option>
          </Select>
        }
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              whitespace: true,
              message: "Please input passenger's name or delete this field."
            }
          ]
        })(
          <Input
            placeholder='input your social network website'
            style={
              keys.length === 1
                ? { width: '100%', marginRight: 8 }
                : { width: '95%', marginRight: 8 }
            }
          />
        )}
        {keys.length > 1 ? (
          <Icon
            className='dynamic-delete-button'
            type='minus-circle-o'
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <section
        className={`${clsPrefix}-container card-container page-container`}
      >
        <h3 className={`${clsPrefix}-title`}>填写节点信息</h3>
        <Form
          className={`${clsPrefix}-form`}
          {...TeamInfoFormItemLayout}
          onSubmit={this.handleSubmit}
        >
          {teamInfoKeyInForm.formItems &&
            teamInfoKeyInForm.formItems.map(item => {
              return (
                <Form.Item label={item.label} key={item.label}>
                  {item.render ? (
                    item.render
                  ) : item.validator ? (
                    getFieldDecorator(item.fieldDecoratorid, item.validator)(
                      <Input placeholder={item.placeholder} />
                    )
                  ) : (
                    <Input placeholder={item.placeholder} />
                  )}
                </Form.Item>
              );
            })}
          {formItems}
          {keys.length < 5 ? (
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button
                type='dashed'
                onClick={this.add}
                style={{ width: '90%', float: 'right' }}
              >
                <Icon type='plus' /> Add Social Network
              </Button>
            </Form.Item>
          ) : null}
        </Form>
        <div className={`${clsPrefix}-footer`}>
          <Button type='primary'>Apply Now</Button>
        </div>
      </section>
    );
  }
}

export default Form.create({})(CandidateApply);
