/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-16 17:33:33
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-09 19:06:59
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
import { APPNAME } from '@config/config';
import { post, get } from '@src/utils';
import { rand16Num } from '@utils/utils';
import { NO_AUTHORIZATION_ERROR_TIP, UNLOCK_PLUGIN_TIP } from '@src/constants';
import getCurrentWallet from '@utils/getCurrentWallet';
import { urlRegExp } from '@pages/Vote/constants';
import { addUrlPrefix, removeUrlPrefix } from '@utils/formater';
import './index.less';

// const reg = /^[.-\w]+$/;
const { Option } = Select;
const { TextArea } = Input;

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
        render: <Input addonBefore="https://" placeholder="Input avatar url:" />
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
          <Input addonBefore="https://" placeholder="Input your website:" />
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
            placeholder="Intro your team here:"
            autosize={{ minRows: 3, maxRows: 6 }}
          />
        )
      }
    ]
  };
}

const clsPrefix = 'candidate-apply-team-info-key-in';

class KeyInTeamInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      // todo: What if I put the state hasAuth in the upper component Vote? Will it better?
      // todo: If the pattern of verifying authoriztion are all the same, consider to use HOC.
      hasAuth: false, // todo: Is it necessary to verify the authorization in the page?
      teamInfoKeyInForm: generateTeamInfoKeyInForm({}),
      teamInfo: null
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

  getUnlockPluginText() {
    return (
      <section className={`card-container`}>
        <Result
          icon={<Icon type="lock" theme="twoTone" twoToneColor="#2b006c" />}
          status="warning"
          title={UNLOCK_PLUGIN_TIP}
        />
      </section>
    );
  }

  getSocialFormItems() {
    const { getFieldValue, getFieldDecorator } = this.props.form;
    const { teamInfo } = this.state;

    const keys = getFieldValue('keys');

    const formItems = keys.map((k, index) => {
      return (
        <Form.Item
          {...TeamInfoFormItemLayout}
          label={getFieldDecorator(`types[${k}]`, {
            // todo: Optimize
            initialValue:
              (teamInfo &&
                teamInfo.socials &&
                teamInfo.socials[k] &&
                teamInfo.socials[k].type) ||
              socialDefaultValue
          })(
            <Select
              style={{ width: '60%' }}
              // onChange={value => {
              //   this.onSocialTypeChange(k, value);
              // }}
            >
              <Option value="Facebook">Facebook</Option>
              <Option value="Telegram">Telegram</Option>
              <Option value="Twitter">Twitter</Option>
              <Option value="Steemit">Steemit</Option>
              <Option value="Github">Github</Option>
            </Select>
          )}
          required={false}
          key={k}
        >
          {// todo: How to use the decorator id like socials[${k}].url?
          getFieldDecorator(`socials[${k}]`, {
            // todo: Optimize
            initialValue:
              (teamInfo &&
                teamInfo.socials &&
                teamInfo.socials[k] &&
                teamInfo.socials[k].url) ||
              null,
            validateTrigger: ['onBlur'],
            rules: [
              {
                pattern: urlRegExp,
                message: 'The input is not valid url!'
              }
            ]
          })(
            <Input
              addonBefore="https://"
              placeholder="input your social network website"
              style={
                keys.length === 1
                  ? { width: '100%', marginRight: 8 }
                  : { width: '95%', marginRight: 8 }
              }
            />
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      );
    });
    return formItems;
  }

  getRealContent() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { hasAuth, teamInfoKeyInForm, isLoading, teamInfo } = this.state;

    const keys = getFieldValue('keys');
    getFieldDecorator('keys', {
      initialValue: teamInfo
        ? teamInfo.socials.map((item, index) => index)
        : [0]
    });

    const socialFormItems = this.getSocialFormItems();

    return (
      <div className="loading-container has-mask-on-mobile">
        {isLoading ? (
          <Spin spinning={isLoading} />
        ) : (
          <section className={`${clsPrefix}-container card-container`}>
            {hasAuth ? (
              // eslint-disable-next-line react/jsx-fragments
              <React.Fragment>
                <h3 className={`${clsPrefix}-title`}>Keyin Team Info</h3>
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
                  {socialFormItems}
                  {keys.length < 5 ? (
                    <Form.Item {...formItemLayoutWithOutLabel}>
                      <Button
                        type="primary"
                        onClick={this.add}
                        style={{ width: '90%', float: 'right' }}
                      >
                        <Icon type="plus" /> Add Social Network
                      </Button>
                    </Form.Item>
                  ) : null}
                </Form>
                <div className={`${clsPrefix}-footer`}>
                  <Button
                    type="submit"
                    htmlType="submit"
                    onClick={this.handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              // <p className={`${clsPrefix}-no-auth`}>
              //   Sorry, only the node that is current term's node can edit the team
              //   info.
              // </p>
              <Result
                status="403"
                title={NO_AUTHORIZATION_ERROR_TIP}
                extra={
                  <Button type="primary" onClick={this.handleBack}>
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
    // Avoid key repeating
    const nextKeys = keys.concat(keys[keys.length - 1] + 1);
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
      publicKey: currentWallet.pubkey
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
          teamInfo: values,
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
          return { type: subItem.type, url: processor(subItem.url) };
        });
      } else {
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
    const { nightElf, checkExtensionLockStatus } = this.props;

    const currentWallet = getCurrentWallet();
    // todo: unify the name of public key. e.g. publicKey & pubkey & pubKey
    const publicKey = `04${currentWallet.publicKey.x}${currentWallet.publicKey.y}`;
    const randomNum = rand16Num(32);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // values.socials = null;
        values.socials = values.socials
          // todo: Maybe the comment below are wrong
          // Do map before filter
          .map((item, index) => {
            return {
              type: values.types[index],
              url: item
            };
          })
          .filter(
            item =>
              item.url !== undefined && item.url !== null && item.url !== ''
          );
        delete values.keys; // remove unneed element
        delete values.types; // remove unneed element
        this.processUrl(values, addUrlPrefix);

        checkExtensionLockStatus().then(async () => {
          const { signature } = await nightElf.getSignature({
            appName: APPNAME,
            address: currentWallet.address,
            hexToBeSign: randomNum
          });
          post('/vote/addTeamDesc', {
            isActive: true,
            publicKey,
            address: currentWallet.address,
            random: randomNum,
            signature,
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
        });
      }
    });
  }

  handleBack() {
    // todo: if the user enter the page by input url, will it get wrong?
    this.props.history.goBack();
  }

  render() {
    const { isPluginLock } = this.props;

    const unlockPluginText = this.getUnlockPluginText();
    const realContent = this.getRealContent();

    // todo: Skeleton is invisible in current background
    return (
      <React.Fragment>
        {isPluginLock ? unlockPluginText : realContent}
      </React.Fragment>
    );
  }
}

export default withRouter(Form.create({})(KeyInTeamInfo));
