/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-16 17:33:33
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-26 18:25:46
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
  Modal,
  Spin
} from 'antd';
import queryString from 'query-string';

// import PicUpload from './PicUpload';
import { post, get } from '@src/utils';
import { NO_AUTHORIZATION_ERROR_TIP } from '@src/constants';
import getCurrentWallet from '@utils/getCurrentWallet';
import { urlRegExp } from '@pages/Vote/constants';
import { addUrlPrefix, removeUrlPrefix } from '@utils/formater';
import './index.less';

// const reg = /^[.-\w]+$/;
const { Option } = Select;
const { TextArea } = Input;

let id = 1;
const socialDefaultValue = 'Github';

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
              message: 'Only support english alpha, number and symbol - . _'
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
          validateTrigger: ['onBlur'],
          initialValue: data.avatar
        },
        render: <Input addonBefore='https://' placeholder='Input avatar url:' />
      },
      {
        label: 'Location',
        validator: {
          fieldDecoratorid: 'location',
          initialValue: data.location
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
          ],
          validateTrigger: ['onBlur'],
          initialValue: data.officialWebsite
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
          fieldDecoratorid: 'mail',
          initialValue: data.mail,
          validateTrigger: ['onBlur']
        },
        placeholder: 'Input your email:'
      },
      {
        label: 'Intro',
        validator: {
          fieldDecoratorid: 'intro',
          initialValue: data.intro
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
      isLoading: true,
      // todo: What if I put the state hasAuth in the upper component Vote? Will it better?
      // todo: If the pattern of verifying authoriztion are all the same, consider to use HOC.
      hasAuth: false, // todo: Is it necessary to verify the authorization in the page?
      teamInfoKeyInForm: generateTeamInfoKeyInForm({})
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);

    this.teamPubkey = queryString.parse(window.location.search).pubkey;
  }

  // todo: do the same thing when cdm and cdu, how to optimize?
  // cdm: jump from Vote; cdu: enter from url

  componentDidMount() {
    const { currentWallet } = this.props;

    if (currentWallet) {
      this.setState(
        {
          hasAuth: currentWallet.pubkey === this.teamPubkey
        },
        this.fetchCandidateInfo
      );
    }
  }

  componentDidUpdate(prevProps) {
    const { currentWallet } = this.props;

    if (prevProps.currentWallet !== currentWallet) {
      this.setState(
        {
          hasAuth: currentWallet.pubkey === this.teamPubkey
        },
        this.fetchCandidateInfo
      );
    }
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

  formatResData(data) {
    data.avatar;
  }

  fetchCandidateInfo() {
    const { currentWallet } = this.props;

    get('/vote/getTeamDesc', {
      publicKey: currentWallet.pubKey
    })
      .then(res => {
        console.log('res', res);
        this.setState({
          isLoading: false
        });
        if (res.code !== 0) return;
        const values = res.data;
        this.processUrl(values, removeUrlPrefix);
        this.setState({
          teamInfoKeyInForm: generateTeamInfoKeyInForm(values)
        });
      })
      .catch(err => {
        console.error('err', err);
      });
  }

  // todo: optimize
  processUrl(values, processor) {
    ['avatar', 'officialWebsite', 'socials'].forEach(item => {
      const value = values[item];
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        values[item] = value.map(subItem => {
          if (subItem === undefined || value === null) return;
          return processor(subItem.url);
        });
      } else {
        if (value === undefined || value === null) return;
        values[item] = processor(value);
      }
    });
  }

  onSocialTypeChange(k, value) {
    const socials = this.props.form.getFieldValue('socials');
    socials[k].type = value;
    console.log({
      socials
    });
    this.props.form.setFieldsValue(socials);
  }

  handleSubmit(e) {
    e.preventDefault();
    const currentWallet = getCurrentWallet();
    // todo: unify the name of public key. e.g. publicKey & pubkey & pubKey
    const publicKey = `04${currentWallet.publicKey.x}${currentWallet.publicKey.y}`;

    this.props.form.validateFields((err, values) => {
      debugger;
      if (!err) {
        this.processUrl(values, addUrlPrefix);
        // values.socials = null;
        delete values.keys; // remove unneed element
        post('/vote/addTeamDesc', {
          isActive: true,
          publicKey,
          address: currentWallet.address,
          ...values
        }).then(res => {
          if (res.code === 0)
            this.props.history.push({
              pathname: '/vote/team',
              search: `pubkey=${publicKey}`
            });
          else {
            console.error(res);
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
    const { hasAuth, teamInfoKeyInForm, isLoading } = this.state;

    getFieldDecorator('keys', { initialValue: [0] });
    getFieldDecorator('socials', {
      initialValue: [{ type: socialDefaultValue, value: null }]
    });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      const socialItem = getFieldValue('socials')[k];
      if (!socialItem) return;
      const { type } = socialItem;
      return (
        <Form.Item
          {...TeamInfoFormItemLayout}
          label={
            <Select
              defaultValue={socialDefaultValue}
              style={{ width: '60%' }}
              onChange={value => {
                this.onSocialTypeChange(k, value);
              }}
              value={type}
            >
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
          {getFieldDecorator(`socials[${k}].url`, {
            initialValue: null,
            validateTrigger: ['onBlur'],
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
      );
    });

    console.log({
      hasAuth,
      teamPubkey: this.teamPubkey,
      currentWallet: this.props.currentWallet
    });

    // todo: Skeleton is invisible in current background
    return (
      <div className='loading-container'>
        {isLoading ? (
          <Spin spinning={isLoading} size='large' />
        ) : (
          <section
            className={`${clsPrefix}-container card-container page-container`}
          >
            {hasAuth ? (
              // eslint-disable-next-line react/jsx-fragments
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
                title={NO_AUTHORIZATION_ERROR_TIP}
                extra={
                  <Button type='primary' onClick={this.handleBack}>
                    Go Back
                  </Button>
                }
              />
            )}
          </section>
        )}
      </div>
    );
  }
}

export default withRouter(Form.create({})(CandidateApply));
