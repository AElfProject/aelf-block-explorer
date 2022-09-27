/**
 * @file create normal proposal
 * @author atom-yang
 */
import React, { useEffect, useState, Suspense, lazy } from 'react';
import moment from 'moment';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Form,
  Select,
  DatePicker,
  Button,
  Tooltip,
  // eslint-disable-next-line no-unused-vars
  Radio,
  Input,
  message,
  Spin,
} from 'antd';
import PropTypes from 'prop-types';
import {
  isInnerType,
  isSpecialParameters,
  formatTimeToNano,
  parseJSON,
  commonFilter,
  isSingleStringParameter,
  isEmptyInputType,
} from 'page-components/Proposal/common/utils';
import constants, { API_PATH } from 'page-components/Proposal/common/constants';
import { request } from 'utils/request';
require('./index.less');
import { validateURL, getContractMethodList, CONTRACT_INSTANCE_MAP } from 'utils/utils';

const JSONEditor = lazy(() => import(/* webpackChunkName: "jsonEditor" */ 'page-components/Proposal/JSONEditor'));

const { proposalTypes } = constants;

const { Item: FormItem } = Form;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 8 },
  },
};

const FIELDS_MAP = {
  formProposalType: {
    name: 'formProposalType',
    label: (
      <span>
        Proposal Mode&nbsp;
        <Tooltip
          title="There are currently three proposal models.
          After selecting one, you will need to operate according to its rules.
          For specific rules, see 'Proposal rules'">
          <QuestionCircleOutlined className="main-color" />
        </Tooltip>
      </span>
    ),
    placeholder: 'Please select a proposal mode',
    rules: [
      {
        required: true,
        message: 'Please select a proposal mode!',
      },
    ],
  },
  formOrgAddress: {
    name: 'formOrgAddress',
    label: (
      <span>
        Organization&nbsp;
        <Tooltip
          title="Choose an organization you trust.
          The organization will vote for your proposal.
          You also need to follow the rules of the organization.
          For the specific rules, see 'Organizations Tab'">
          <QuestionCircleOutlined className="main-color" />
        </Tooltip>
      </span>
    ),
    placeholder: 'Please select an organization',
    rules: [
      {
        required: true,
        message: 'Please select an organization!',
      },
    ],
  },
  formContractAddress: {
    name: 'formContractAddress',
    label: 'Contract Address',
    placeholder: 'Please select a contract',
    rules: [
      {
        required: true,
        message: 'Please select a contract!',
      },
    ],
  },
  formContractMethod: {
    name: 'formContractMethod',
    label: 'Method Name',
    placeholder: 'Please select a contract method',
    rules: [
      {
        required: true,
        message: 'Please select a contact method!',
      },
    ],
  },
  params: {
    label: 'Method Params',
  },
  formExpiredTime: {
    name: 'formExpiredTime',
    label: (
      <span>
        Expiration Time&nbsp;
        <Tooltip title="Proposals must be voted on and released before the expiration time">
          <QuestionCircleOutlined className="main-color" />
        </Tooltip>
      </span>
    ),
    placeholder: 'Please select a time',
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Please select a time!',
      },
    ],
  },
  formDescriptionURL: {
    name: 'formDescriptionURL',
    label: (
      <span>
        URL&nbsp;
        <Tooltip title="Please provide a URL describing the proposal">
          <QuestionCircleOutlined className="main-color" />
        </Tooltip>
      </span>
    ),
    placeholder: 'Please input the description URL of proposal',
    validateTrigger: 'onBlur',
    rules: [
      {
        validator(rule, value) {
          if (value && value.length > 0 && !validateURL(`https://${value}`)) {
            return Promise.reject(new Error('Please check your URL format'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
};

const contractFilter = (input, _, list) =>
  list.filter(({ contractName, address }) => contractName.indexOf(input) > -1 || address.indexOf(input) > -1).length >
  0;

async function getOrganizationBySearch(currentWallet, proposalType, search = '') {
  return request(
    API_PATH.GET_AUDIT_ORGANIZATIONS,
    {
      address: currentWallet.address,
      search,
      proposalType,
    },
    { method: 'GET' },
  );
}

async function getContractAddress(search = '') {
  return request(
    API_PATH.GET_ALL_CONTRACTS,
    {
      search,
    },
    { method: 'GET' },
  );
}

const disabledDate = (date) => date && moment().isAfter(date);

const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 16,
      offset: 6,
    },
  },
};

function parsedParams(inputType, originalParams) {
  const fieldsLength = Object.keys(inputType.toJSON().fields || {}).length;
  let result = {};
  if (fieldsLength === 0) {
    return '';
  }
  if (isInnerType(inputType)) {
    const type = inputType.fieldsArray[0];
    return originalParams[type.name];
  }
  Object.keys(originalParams).forEach((name) => {
    const value = originalParams[name];
    const type = inputType.fields[name];
    if (value === '' || value === null || value === undefined) {
      return;
    }
    if (
      !Array.isArray(value) &&
      typeof value === 'object' &&
      value !== null &&
      (type.type || '').indexOf('google.protobuf.Timestamp') === -1
    ) {
      result = {
        ...result,
        [name]: parsedParams(type.resolvedType, value),
      };
    } else if ((type.type || '').indexOf('google.protobuf.Timestamp') > -1) {
      result = {
        ...result,
        [name]: Array.isArray(value) ? value.filter((v) => v).map(formatTimeToNano) : formatTimeToNano(value),
      };
    } else if (isSpecialParameters(type)) {
      result = {
        ...result,
        [name]: Array.isArray(value) ? value.filter((v) => v) : value,
      };
    } else {
      result = {
        ...result,
        [name]: Array.isArray(value) ? value.filter((v) => v) : value,
      };
    }
  });
  return result;
}

// eslint-disable-next-line no-unused-vars
function parsedParamsWithoutSpecial(inputType, originalParams) {
  const fieldsLength = Object.keys(inputType.toJSON().fields || {}).length;
  let result = {};
  if (fieldsLength === 0) {
    return result;
  }
  Object.keys(originalParams).forEach((name) => {
    const value = originalParams[name];
    const type = inputType.fields[name];
    if (value === '' || value === null || value === undefined) {
      return;
    }
    if (
      !Array.isArray(value) &&
      typeof value === 'object' &&
      value !== null &&
      (type.type || '').indexOf('google.protobuf.Timestamp') === -1
    ) {
      result = {
        ...result,
        [name]: parsedParams(type.resolvedType, value),
      };
    } else if ((type.type || '').indexOf('google.protobuf.Timestamp') > -1) {
      result = {
        ...result,
        [name]: Array.isArray(value) ? value.filter((v) => v).map(formatTimeToNano) : formatTimeToNano(value),
      };
    } else if ((type.type || '').indexOf('int') > -1) {
      result = {
        ...result,
        [name]: Array.isArray(value) ? value.filter((v) => parseInt(v, 10)) : parseInt(value, 10),
      };
    } else {
      result = {
        ...result,
        [name]: Array.isArray(value) ? value.filter((v) => v) : value,
      };
    }
  });
  return result;
}

const URLPrefix = (props) => {
  const { formField } = props;
  return (
    <FormItem name={formField} required noStyle>
      <Select>
        <Select.Option value="https://">https://</Select.Option>
        <Select.Option value="http://">http://</Select.Option>
      </Select>
    </FormItem>
  );
};

URLPrefix.propTypes = {
  formField: PropTypes.string.isRequired,
};

const SuspenseJSONEditor = (props) => (
  <Suspense fallback={<Spin className="text-ellipsis" />}>
    <JSONEditor className="params-input" {...props} />
  </Suspense>
);

const NormalProposal = (props) => {
  const { aelf, isModify, proposalType, orgAddress, contractAddress, submit, currentWallet } = props;
  const [form] = Form.useForm();
  const { setFieldsValue, validateFields } = form;

  const [methods, setMethods] = useState({
    list: [],
    isSingleString: false,
    isEmpty: false,
  });
  // eslint-disable-next-line no-unused-vars
  const [paramsInputMethod, setParamsInputMethod] = useState('plain');
  const [organizationList, setOrganizationList] = useState([]);
  const [contractList, setContractList] = useState([]);
  // const [methodList, setMethodList] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState({
    orgAddress: false,
    contractAddress: true,
    contractMethod: false,
  });

  const handleContractAddressChange = async (address) => {
    let list = [];
    try {
      setFieldsValue({
        formContractMethod: '',
      });
      setMethods({
        ...methods,
        list: [],
        contractAddress: '',
        methodName: '',
      });
      setLoadingStatus({
        ...loadingStatus,
        contractAddress: false,
        contractMethod: true,
      });
      list = await getContractMethodList(aelf, address);
    } catch (e) {
      message.error(e.message || 'Querying contract address list failed!');
    } finally {
      setLoadingStatus({
        ...loadingStatus,
        contractMethod: false,
        contractAddress: false,
      });
      setMethods({
        ...methods,
        list,
        contractAddress: address,
        methodName: '',
      });
    }
  };

  const handleProposalTypeChange = async (type) => {
    let list = [];
    try {
      setFieldsValue({
        formOrgAddress: '',
      });
      setLoadingStatus({
        ...loadingStatus,
        contractAddress: false,
        orgAddress: true,
      });
      list = await getOrganizationBySearch(currentWallet, type);
      list = list || [];
    } catch (e) {
      message.error(e.message || 'Querying contract address list failed!');
    } finally {
      setLoadingStatus({
        ...loadingStatus,
        contractAddress: false,
        orgAddress: false,
      });
      setOrganizationList(list);
    }
  };
  useEffect(() => {
    getContractAddress('')
      .then((res) => {
        setContractList(res.list);
        setLoadingStatus({
          ...loadingStatus,
          contractAddress: false,
        });
      })
      .catch((e) => {
        setLoadingStatus({
          ...loadingStatus,
          contractAddress: false,
        });
        message.error(e.message | 'Network Error!');
      });
    if (isModify === true) {
      handleContractAddressChange(contractAddress);
      getOrganizationBySearch(currentWallet, proposalType).then((res) => {
        setOrganizationList(res);
      });
    }
  }, []);

  const handleMethodChange = (method) => {
    setMethods({
      ...methods,
      methodName: method,
      isSingleString: isSingleStringParameter(CONTRACT_INSTANCE_MAP[methods.contractAddress][method].inputType),
      isEmpty: isEmptyInputType(CONTRACT_INSTANCE_MAP[methods.contractAddress][method].inputType),
    });
  };

  // eslint-disable-next-line no-unused-vars
  // function handleInputMethod(e) {
  //   setParamsInputMethod(e.target.value);
  // }

  const handleSubmit = async () => {
    let result;
    try {
      result = await validateFields();
      const {
        formProposalType,
        formOrgAddress,
        formContractAddress,
        formContractMethod,
        formExpiredTime,
        formDescriptionURL,
        formPrefix,
        ...leftParams
      } = result;
      const method = CONTRACT_INSTANCE_MAP[methods.contractAddress][methods.methodName];
      const { inputType } = method;
      let parsed;
      if (paramsInputMethod === 'format') {
        parsed = parsedParams(inputType, leftParams);
        // 校验不好使，对于integer string类型不好操作
        // const error = inputType.verify(parsedParamsWithoutSpecial(inputType, leftParams));
        // if (error) {
        //   throw new Error(`Contract params ${error}`);
        // }
      } else {
        parsed = parseJSON(leftParams.realSpecialPlain);
        // 无法verify
        // const error = inputType.verify(parsedParamsWithoutSpecial(inputType, parsed));
        // if (error) {
        //   throw new Error(`Contract params ${error}`);
        // }
      }
      let decoded;
      if (Array.isArray(parsed)) {
        decoded = method.packInput([...parsed]);
      } else if (typeof parsed === 'object' && parsed !== null) {
        decoded = method.packInput(JSON.parse(JSON.stringify(parsed)));
      } else {
        decoded = method.packInput(parsed);
      }
      submit({
        expiredTime: formExpiredTime,
        contractMethodName: formContractMethod,
        toAddress: formContractAddress,
        proposalType: formProposalType,
        organizationAddress: formOrgAddress,
        proposalDescriptionUrl:
          formDescriptionURL && formDescriptionURL.length > 0 ? `${formPrefix}${formDescriptionURL}` : '',
        params: {
          origin: parsed,
          decoded,
        },
      });
    } catch (e) {
      message.error(e.message || 'Please input the required form!');
    }
  };

  return (
    <div className="normal-proposal">
      <Form
        form={form}
        {...formItemLayout}
        initialValues={{
          formProposalType: isModify ? proposalType : '',
          formOrgAddress: isModify ? orgAddress : '',
          formContractAddress: isModify ? contractAddress : '',
          formPrefix: 'https://',
          realSpecialPlain: '',
        }}>
        <FormItem label={FIELDS_MAP.formProposalType.label} required {...FIELDS_MAP.formProposalType}>
          <Select placeholder={FIELDS_MAP.formProposalType.placeholder} onChange={handleProposalTypeChange}>
            <Select.Option value={proposalTypes.PARLIAMENT}>{proposalTypes.PARLIAMENT}</Select.Option>
            <Select.Option value={proposalTypes.ASSOCIATION}>{proposalTypes.ASSOCIATION}</Select.Option>
            <Select.Option value={proposalTypes.REFERENDUM}>{proposalTypes.REFERENDUM}</Select.Option>
          </Select>
        </FormItem>
        <FormItem label={FIELDS_MAP.formOrgAddress.label} required {...FIELDS_MAP.formOrgAddress}>
          <Select
            placeholder={FIELDS_MAP.formOrgAddress.placeholder}
            loading={loadingStatus.orgAddress}
            showSearch
            optionFilterProp="children"
            filterOption={commonFilter}>
            {organizationList.map((v) => (
              <Select.Option key={v} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label={FIELDS_MAP.formContractAddress.label} required {...FIELDS_MAP.formContractAddress}>
          <Select
            placeholder={FIELDS_MAP.formContractAddress.placeholder}
            onChange={handleContractAddressChange}
            showSearch
            optionFilterProp="children"
            filterOption={(...args) => contractFilter(...args, contractList)}
            loading={loadingStatus.contractAddress}>
            {contractList.map((v) => (
              <Select.Option key={v.address} value={v.address}>
                {v.contractName || v.address}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label={FIELDS_MAP.formContractMethod.label} required {...FIELDS_MAP.formContractMethod}>
          <Select
            placeholder={FIELDS_MAP.formContractMethod.placeholder}
            showSearch
            optionFilterProp="children"
            filterOption={commonFilter}
            loading={loadingStatus.contractMethod}
            onChange={handleMethodChange}>
            {methods.list.map((v) => (
              <Select.Option key={v} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          label={FIELDS_MAP.params.label}
          className={methods && methods.methodName && !methods.isEmpty ? 'normal-proposal-params' : ''}
          required
          name="realSpecialPlain"
          trigger="onBlur">
          {paramsInputMethod === 'plain' && methods && methods.methodName && !methods.isEmpty ? (
            <SuspenseJSONEditor type={methods.isSingleString ? 'plaintext' : 'json'} />
          ) : (
            <div />
          )}
        </FormItem>
        <FormItem label={FIELDS_MAP.formDescriptionURL.label} {...FIELDS_MAP.formDescriptionURL}>
          <Input
            addonBefore={<URLPrefix formField="formPrefix" />}
            placeholder={FIELDS_MAP.formDescriptionURL.placeholder}
          />
        </FormItem>
        <FormItem label={FIELDS_MAP.formExpiredTime.label} required {...FIELDS_MAP.formExpiredTime}>
          <DatePicker
            showTime
            disabledDate={disabledDate}
            disabledTime={disabledDate}
            placeholder={FIELDS_MAP.formExpiredTime.placeholder}
          />
        </FormItem>
        <Form.Item {...tailFormItemLayout}>
          <Button shape="round" type="primary" onClick={handleSubmit}>
            Apply
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

NormalProposal.propTypes = {
  aelf: PropTypes.shape({
    chain: PropTypes.object,
  }).isRequired,
  isModify: PropTypes.bool.isRequired,
  proposalType: PropTypes.string,
  orgAddress: PropTypes.string,
  contractAddress: PropTypes.string,
  submit: PropTypes.func.isRequired,
  wallet: PropTypes.shape({
    sign: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
  }).isRequired,
  currentWallet: PropTypes.shape({
    address: PropTypes.string,
    publicKey: PropTypes.string,
  }).isRequired,
};

NormalProposal.defaultProps = {
  proposalType: '',
  orgAddress: '',
  contractAddress: '',
};

export default NormalProposal;
