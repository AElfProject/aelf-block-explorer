/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-16 17:33:33
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-19 14:56:44
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Select,
  Icon,
  Result,
  message,
  Modal
} from 'antd';

// import PicUpload from './PicUpload';
import { post, get } from '@src/utils';
import { pubKey, address } from '@utils/getCurrentWallet';
import { urlRegExp } from '@pages/Vote/constants';
import { addUrlPrefix } from '@utils/formater';
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

function generateTeamInfoKeyInForm(data) {
  return {
    formItems: [
      {
        label: 'Node Name',
        validator: {
          rules: [
            // todo: add the validator rule
            {
              required: true,
              message: 'Please input your node name!'
            },
            {
              pattern: /^[.-\w]+$/,
              message: 'Only support english alpha and symbol - . _'
            }
          ],
          validateTrigger: ['onChange', 'onBlur'],
          fieldDecoratorid: 'name',
          initialValue: data.name
        },
        placeholder: 'Input your node name:'
      },
      {
        label: 'Node Avatar',
        validator: {
          fieldDecoratorid: 'avatar',
          rules: [
            {
              // todo: PR to antd
              pattern: urlRegExp,
              message: 'The input is not valid url!'
            }
          ],
          validateTrigger: ['onChange', 'onBlur'],
          initialValue: data.avatar
        },
        render: <Input addonBefore='https://' placeholder='Input avatar url:' />
      },
      {
        label: 'Location',
        validator: {
          fieldDecoratorid: 'location'
        },
        placeholder: 'Input your location:'
      },
      {
        label: 'Official Website',
        validator: {
          fieldDecoratorid: 'officialWebsite',
          rules: [
            {
              pattern: urlRegExp,
              message: 'The input is not valid url!'
            }
          ]
        },
        render: (
          <Input addonBefore='https://' placeholder='Input your website:' />
        )
      },
      {
        label: 'Email',
        validator: {
          rules: [
            {
              type: 'email',
              message: 'The input is not valid E-mail!'
            }
          ],
          fieldDecoratorid: 'mail'
        },
        placeholder: 'Input your email:'
      },
      {
        label: 'Intro',
        validator: {
          fieldDecoratorid: 'intro'
        },
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

const clsPrefix = 'candidate-apply-team-info-key-in';

class CandidateApply extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasAuth: false,
      teamInfoKeyInForm: generateTeamInfoKeyInForm({})
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { electionContract } = this.props;

    if (prevProps.electionContract !== electionContract)
      electionContract.GetCandidateInformation.call({
        value: pubKey
      })
        .then(res => {
          this.setState(
            {
              // todo: for dev
              // hasAuth: res.isCurrentCandidate
              hasAuth: true
            },
            () => {
              get('/vote/getTeamDesc', {
                publicKey: pubKey
              })
                .then(teamDesc => {
                  console.log('teamDesc', teamDesc);
                  if (teamDesc.code !== 0) return;
                  this.setState({
                    teamInfoKeyInForm: generateTeamInfoKeyInForm({
                      ...teamDesc.data
                    })
                  });
                })
                .catch(err => {
                  console.error('err', err);
                });
            }
          );
        })
        .catch(err => {
          console.log(err);
        });
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // todo: can I remove it?
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

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        ['avatar', 'officialWebsite', 'socials'].forEach(item => {
          const value = values[item];
          if (value === undefined || value === null) return;
          if (Array.isArray(value)) {
            values[item] = value.map(subItem => {
              if (subItem === undefined || value === null) return;
              return addUrlPrefix(subItem);
            });
          } else {
            if (value === undefined || value === null) return;
            values[item] = addUrlPrefix(value);
          }
        });
        values.socials = null;
        post('/vote/addTeamDesc', {
          isActive: true,
          publicKey: pubKey,
          address,
          ...values
        }).then(res => {
          if (res.code === 0) this.props.history.push('/vote/team/');
          else {
            message.error(res.msg);
          }
        });
      } else {
        Modal.error({ title: 'Please input the right items', centered: true });
      }
    });
  }

  handleBack() {
    // todo: if the user enter the page by input url, will it get wrong?
    this.props.history.goBack();
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { hasAuth, teamInfoKeyInForm } = this.state;

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
        {getFieldDecorator(`socials[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              pattern: urlRegExp,
              message: 'The input is not valid url!'
            }
          ]
        })(
          <Input
            addonBefore='https://'
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
        {hasAuth ? (
          <React.Fragment>
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
                      {/* todo: Optimize the judge */}
                      {item.validator ? (
                        getFieldDecorator(
                          item.validator.fieldDecoratorid,
                          item.validator
                        )(item.render || <Input />)
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
              <Button
                type='submit'
                htmlType='submit'
                onClick={this.handleSubmit}
              >
                Apply Now
              </Button>
            </div>
          </React.Fragment>
        ) : (
          // <p className={`${clsPrefix}-no-auth`}>
          //   Sorry, only the node that is current term's node can edit the team
          //   info.
          // </p>
          <Result
            status='warning'
            title='There are some problems with your operation.'
            extra={
              <Button type='primary' onClick={this.handleBack}>
                Go Back
              </Button>
            }
          />
        )}
      </section>
    );
  }
}

export default withRouter(Form.create({})(CandidateApply));
