import React, { PureComponent } from 'react';
import { withRouter } from 'next/router';
import { Form, Input, Button, Result, message, Spin } from 'antd';
import queryString from 'query-string';
import { APPNAME } from 'constants/config/config';
import { post, get } from 'utils/axios';
import { rand16Num } from 'utils/utils';
import { NO_AUTHORIZATION_ERROR_TIP, UNLOCK_PLUGIN_TIP } from 'constants/info';
import getCurrentWallet from 'utils/getCurrentWallet';
import { urlRegExp } from 'page-components/Vote/constants';
import { addUrlPrefix, removeUrlPrefix } from 'utils/formater';
import { getPublicKeyFromObject } from 'utils/getPublicKey';
import { LockTwoTone } from '@ant-design/icons';
require('./index.less');

const { TextArea } = Input;

const TeamInfoFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const clsPrefix = 'candidate-apply-team-info-key-in';

class KeyInTeamInfo extends PureComponent {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.socialKeys = ['Github', 'Facebook', 'Telegram', 'Twitter', 'Steemit'];
    this.state = {
      isLoading: true,
      hasAuth: false,
      teamInfoKeyInForm: this.generateTeamInfoKeyInForm({}),
      teamInfo: {
        socials: [],
      },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);

    this.teamPubkey = queryString.parse(window.location.search).pubkey;
  }

  generateTeamInfoKeyInForm(data) {
    // initialValue only init once, if want to change u should use setFieldsValue
    this.formRef.current?.setFieldsValue({
      name: data.name,
      avatar: data.avatar,
      location: data.location,
      email: data.email,
      intro: data.intro,
    });
    return {
      formItems: [
        {
          label: 'Node Name',
          validator: {
            rules: [
              // todo: add the validator rule
              {
                required: true,
                message: 'Please input your node name!',
              },
              {
                pattern: /^[.-\w]+$/,
                message: 'Only support english alpha, number and symbol - . _',
              },
            ],
            validateTrigger: ['onChange'],
            fieldDecoratorId: 'name',
            initialValue: data.name || '',
          },
        },
        {
          label: 'Node Avatar',
          validator: {
            fieldDecoratorId: 'avatar',
            rules: [
              {
                pattern: urlRegExp,
                message: 'The input is not valid url!',
              },
            ],
            validateTrigger: ['onBlur'],
            initialValue: data.avatar || '',
          },
          render: <Input addonBefore="https://" placeholder="Input avatar url:" />,
        },
        {
          label: 'Location',
          validator: {
            fieldDecoratorId: 'location',
            initialValue: data.location,
          },
          placeholder: 'Input your location:',
        },
        {
          label: 'Official Website',
          validator: {
            fieldDecoratorId: 'officialWebsite',
            rules: [
              {
                pattern: urlRegExp,
                message: 'The input is not valid url!',
              },
            ],
            validateTrigger: ['onBlur'],
            initialValue: data.officialWebsite || '',
          },
          render: <Input addonBefore="https://" placeholder="Input your website:" />,
        },
        {
          label: 'Email',
          validator: {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
            ],
            fieldDecoratorId: 'mail',
            initialValue: data.mail || '',
            validateTrigger: ['onBlur'],
          },
          placeholder: 'Input your email:',
        },
        {
          label: 'Intro',
          validator: {
            fieldDecoratorId: 'intro',
            initialValue: data.intro || '',
          },
          render: <TextArea placeholder="Intro your team here:" />,
        },
      ],
    };
  }

  componentDidMount() {
    const { currentWallet } = this.props;

    if (currentWallet) {
      this.setState(
        {
          hasAuth: currentWallet.pubkey === this.teamPubkey,
        },
        this.fetchCandidateInfo,
      );
    }
  }

  componentDidUpdate(prevProps) {
    const { currentWallet } = this.props;

    if (currentWallet && currentWallet.address) {
      if (!prevProps.currentWallet || prevProps.currentWallet.address !== currentWallet.address) {
        this.setState(
          {
            hasAuth: currentWallet.pubkey === this.teamPubkey,
          },
          this.fetchCandidateInfo,
        );
      }
    }
  }

  getUnlockPluginText() {
    return (
      <section className="card-container">
        <Result icon={<LockTwoTone twoToneColor="#2b006c" />} status="warning" title={UNLOCK_PLUGIN_TIP} />
      </section>
    );
  }

  getSocialFormItems() {
    const { teamInfo } = this.state;

    return this.socialKeys.map((socialKey) => {
      let initialValue = teamInfo.socials.filter(({ type }) => type === socialKey);
      initialValue = initialValue.length === 0 ? '' : initialValue[0].url;
      return (
        <Form.Item
          {...TeamInfoFormItemLayout}
          label={socialKey}
          required={false}
          key={socialKey}
          name={socialKey}
          initialValue={initialValue}
          validateTrigger={['onBlur']}
          rules={[
            {
              pattern: urlRegExp,
              message: 'The input is not valid url!',
            },
          ]}>
          <Input addonBefore="https://" placeholder="input your social network website" />
        </Form.Item>
      );
    });
  }

  getRealContent() {
    const { hasAuth, teamInfoKeyInForm, isLoading } = this.state;

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
                <h3 className={`${clsPrefix}-title`}>Edit Team Info</h3>
                <Form
                  ref={this.formRef}
                  className={`${clsPrefix}-form`}
                  {...TeamInfoFormItemLayout}
                  onSubmit={this.handleSubmit}>
                  {teamInfoKeyInForm.formItems &&
                    teamInfoKeyInForm.formItems.map((item, index) => {
                      return (
                        <div key={`${item.label}_${index}`}>
                          {item.validator ? (
                            <Form.Item
                              label={item.label}
                              key={item.label}
                              name={item.validator.fieldDecoratorId}
                              rules={item.validator.rules}
                              initialValue={item.validator.initialValue}
                              validateTrigger={item.validator.validateTrigger}>
                              {item.render ? item.render : <Input />}
                            </Form.Item>
                          ) : (
                            <Form.Item label={item.label} key={item.label}>
                              <Input placeholder={item.placeholder} />
                            </Form.Item>
                          )}
                        </div>
                      );
                    })}
                  {socialFormItems}
                </Form>
                <div className={`${clsPrefix}-footer`}>
                  <Button type="submit" htmlType="submit" onClick={this.handleSubmit}>
                    Submit
                  </Button>
                </div>
              </React.Fragment>
            ) : (
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

  fetchCandidateInfo() {
    const { currentWallet } = this.props;

    get('/vote/getTeamDesc', {
      publicKey: currentWallet.pubkey,
    })
      .then((res) => {
        this.setState({
          isLoading: false,
        });
        if (+res.code !== 0) return;
        const values = res.data;
        this.processUrl(values, removeUrlPrefix);
        this.setState({
          teamInfo: values,
          teamInfoKeyInForm: this.generateTeamInfoKeyInForm(values),
        });
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        console.error('err', err);
      });
  }

  processUrl(values, processor) {
    ['avatar', 'officialWebsite', 'socials'].forEach((item) => {
      const value = values[item];
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        values[item] = value
          .filter((v) => !!v)
          .map((subItem) => ({
            type: subItem.type,
            url: processor(subItem.url),
          }));
      } else {
        values[item] = processor(value);
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { nightElf, checkExtensionLockStatus } = this.props;
    const form = this.formRef.current;
    const currentWallet = getCurrentWallet();
    const publicKey = getPublicKeyFromObject(currentWallet.publicKey);
    const randomNum = rand16Num(32);
    form?.validateFields().then(
      (values) => {
        const submitValues = {
          ...values,
        };
        submitValues.socials = this.socialKeys
          .map((socialKey) => {
            const value = submitValues[socialKey];
            delete submitValues[socialKey];
            return {
              type: socialKey,
              url: value,
            };
          })
          .filter(({ type, url }) => {
            return url !== undefined && url !== null && url !== '';
          });
        this.processUrl(submitValues, addUrlPrefix);

        checkExtensionLockStatus().then(async () => {
          const { signature } = await nightElf.getSignature({
            appName: APPNAME,
            address: currentWallet.address,
            hexToBeSign: randomNum,
          });
          post('/vote/addTeamDesc', {
            isActive: true,
            publicKey,
            address: currentWallet.address,
            random: randomNum,
            signature,
            ...submitValues,
          }).then((res) => {
            if (+res.code === 0) {
              this.props.router.push(`/vote/team?pubkey=${publicKey}`);
            } else {
              message.error(res.msg);
            }
          });
        });
      },
      (err) => {
        console.error(err);
      },
    );
  }

  handleBack() {
    this.props.router.back();
  }

  render() {
    const { isPluginLock } = this.props;

    const unlockPluginText = this.getUnlockPluginText();
    const realContent = this.getRealContent();
    return <>{isPluginLock ? unlockPluginText : realContent}</>;
  }
}

export default withRouter(KeyInTeamInfo);
