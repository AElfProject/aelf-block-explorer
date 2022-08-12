/**
 * @file contract proposal
 * @author atom-yang
 */
import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Radio,
  Input,
  Button,
  Upload,
  Select,
  message,
  Tooltip,
  Form,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { request } from '../../../../../common/request';
import { API_PATH } from '../../../common/constants';
import ProposalSearch from '../../../components/ProposalSearch';
import { destorySelectList, getProposalSelectListWrap } from '../../../actions/proposalSelectList';

const FormItem = Form.Item;
const InputNameReg = /^[.,a-zA-Z\d]+$/;

const UpdateType = {
  updateContractName: 'updateContractName',
  updateFile: 'updateFile',
};
// eslint-disable-next-line max-len
const step1 = 'Step 1 - ProposeNewContract: Apply to deploy a new contract(pending pproval from the parliament to enter the next stage);';
// eslint-disable-next-line max-len
const step2 = 'Step 2 - ReleaseApprovalContract: Apply for code check after the contract deployment proposal is approved (the parliament will agree upon the proposal once BPs have completed code check);';
const step3 = 'Step 3 - ReleaseCodeCheckedContract: Contract deployment will be executed once the code check passes.';

export const contractMethodType = {
  ProposeNewContract: 'ProposeNewContract',
  ReleaseApprovedContract: 'ReleaseApprovedContract',
  ReleaseCodeCheckedContract: 'ReleaseCodeCheckedContract',
};

const contractMethodList = [{
  methodTitle: 'Propose New Contract',
  methodType: contractMethodType.ProposeNewContract,
},
{
  methodTitle: 'Release Approved Contract',
  methodType: contractMethodType.ReleaseApprovedContract,
},
{
  methodTitle: 'Release Code Checked Contract',
  methodType: contractMethodType.ReleaseCodeCheckedContract,
}];

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 8 },
  },
};

const radioButtonLayout = {
  wrapperCol: {
    sm: { span: 14, offset: 4 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 16,
      offset: 6,
    },
  },
};

async function checkContractName(rule, value, isUpdate, currentContractInfo, isUpdateName) {
  if (!value) {
    if (isUpdateName && isUpdate) throw new Error('Please enter the contract name！');
    return;
  }
  if (+value === -1) {
    throw new Error('-1 is not valid');
  }
  if (isUpdate && value === currentContractInfo.contractName) {
    if (isUpdateName) {
      throw new Error('The name already exists！');
    } else {
      return;
    }
  }
  if (!InputNameReg.test(value)) {
    throw new Error('Please enter alphanumeric characters only！');
  }
  if (value.length > 150) {
    throw new Error('The maximum input character is 150');
  }

  const result = await request(API_PATH.CHECK_CONTRACT_NAME, {
    contractName: value,
  }, { method: 'GET' });
  const {
    isExist = true,
  } = result;
  if (!isExist) {
    // eslint-disable-next-line consistent-return
    return true;
  }
  throw new Error('The name already exists！');
}

async function validateFile(rule, value) {
  if (!value || (Array.isArray(value) || value.length === 0)) {
    return;
  }
  const file = value[0];
  const {
    size,
  } = file;
  if (size > 0 && size <= 2 * 1024 * 1024) {
    return;
  }
  throw new Error('DLL file is larger than 2MB');
}

function readFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result.split('base64,');
      if (result.length < 2) {
        reject(new Error('file has no content'));
      } else {
        resolve(result[1]);
      }
    };
    setTimeout(() => {
      reject(new Error('file is too large to read'));
    }, 10 * 1000);
  });
}

const ContractProposal = (props) => {
  const {
    loading,
    submit,
  } = props;
  const [form] = Form.useForm();
  const proposalSelect = useSelector((state) => state.proposalSelect);
  const common = useSelector((state) => state.common);
  const {
    currentWallet,
  } = common;
  const dispatch = useDispatch();
  const {
    validateFields,
    setFieldsValue,
    getFieldValue,
  } = form;
  const [fileLength, setFileLength] = useState(0);
  const [currentContractInfo, setCurrentContractInfo] = useState({
    address: '',
    isSystemContract: false,
    contractName: -1,
  });
  const [contractList, setContractList] = useState([]);
  const [checkName, setCheckName] = useState(undefined);
  const [contractMethod, setContractMethod] = useState(contractMethodType.ProposeNewContract);
  const [update, setUpdate] = useState();

  useEffect(() => {
    request(API_PATH.GET_ALL_CONTRACTS, {
      search: '',
    }, { method: 'GET' })
      .then((res) => {
        setContractList(res.list || []);
      })
      .catch((e) => {
        message.error(e.message || 'Network Error');
      });
  }, [update]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isUpdateName, setUpdateName] = useState(false);

  const setContractName = useCallback((name) => {
    setFieldsValue({
      name,
    });
    setCheckName(undefined);
  }, []);
  function handleAction() {
    setContractName('');
    setIsUpdate(!isUpdate);
  }
  const contractFilter = (input) => contractList
    .filter(({ contractName, address }) => contractName.indexOf(input) > -1 || address.indexOf(input) > -1).length > 0;
  function normFile(e) {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  function handleUpload(e) {
    setFileLength(e.fileList.length);
  }

  const checkContractNameHandler = useCallback(async (name) => {
    setCheckName({
      validateStatus: 'validating',
      errorMsg: undefined, // Inquiring...
    });
    try {
      await checkContractName('', name, isUpdate, currentContractInfo, isUpdateName);
      setCheckName({
        validateStatus: 'success',
        errorMsg: undefined, // Inquiring...
      });
    } catch (e) {
      setCheckName({
        validateStatus: 'error',
        errorMsg: e.message,
      });
      throw e;
    }
  }, [isUpdate, currentContractInfo, isUpdateName]);

  async function customValidateFields() {
    const [result] = await Promise.all([
      validateFields(),
      checkContractNameHandler(getFieldValue('name')),
    ]);
    return result;
  }

  async function handleSubmit() {
    try {
      const result = await customValidateFields();
      const {
        action,
        address = '',
        // eslint-disable-next-line no-shadow
        contractMethod = '',
        proposalId,
      } = result;
      let file;
      if (result.file) {
        file = await readFile(result.file[0].originFileObj);
      }
      let name = result.name || '';
      if (isUpdate
        && (currentContractInfo.contractName === name)
      ) {
        name = '';
      }
      console.log(result);
      const submitObj = {
        file,
        action,
        address,
        name,
        proposalId,
        isOnlyUpdateName: isUpdate && isUpdateName,
        contractMethod,
        onSuccess: () => setUpdate(Date.now()),
      };
      submit(submitObj);
    } catch (e) {
      console.error(e);
      message.error(e.message || e?.errorFields?.at?.(-1)?.errors?.[0] || 'Please input the required form!');
    }
  }

  function handleContractChange(address) {
    const info = contractList.filter((v) => v.address === address)[0];
    setCurrentContractInfo(info);
    const name = +info.contractName === -1 ? '' : info.contractName;
    setContractName(name);
  }

  const updateTypeHandler = useCallback((e) => {
    setUpdateName(e.target.value === UpdateType.updateContractName);
    setFieldsValue({
      address: '',
    });
    setContractName('');
  }, []);

  const methosTip = useMemo(() => (
    <>
      <p>Contract Deployment Method:</p>
      <p>{step1}</p>
      <p>{step2}</p>
      <p>{step3}</p>
    </>
  ), []);

  useEffect(() => {
    getProposalSelectListWrap(dispatch, { ...proposalSelect.params, address: currentWallet?.address });
    return () => {
      destorySelectList();
    };
  }, [currentWallet]);

  return (
    <div className="contract-proposal">
      <Form
        form={form}
        initialValues={{
          action: 'ProposeNewContract',
          address: '',
          updateType: UpdateType.updateFile,
          contractMethod: contractMethodType.ProposeNewContract,
          name: +currentContractInfo.contractName === -1 ? '' : currentContractInfo.contractName,
        }}
        onValuesChange={(change) => {
          if ('name' in change) setCheckName(undefined);
          if ('contractMethod' in change) {
            setContractMethod(change.contractMethod);
            setFieldsValue({
              address: '',
              name: '',
              proposalId: '',
            });
          }
          // if ('proposalId' in change) proposalIdChange(change.proposalId);
          if ('updateType' in change || 'action' in change) {
            setFieldsValue({ contractMethod: contractMethodType.ProposeNewContract, proposalId: '' });
            setContractMethod(contractMethodType.ProposeNewContract);
          }
        }}
        {...formItemLayout}
      >
        <FormItem
          label="Contract Action"
          name="action"
        >
          <Radio.Group
            onChange={handleAction}
          >
            <Radio value="ProposeNewContract">Deploy Contract</Radio>
            <Radio value="ProposeUpdateContract">Update Contract</Radio>
          </Radio.Group>
        </FormItem>

        {
          isUpdate
            ? (
              <FormItem
                label=""
                name="updateType"
                {...radioButtonLayout}
              >
                <Radio.Group
                  onChange={updateTypeHandler}
                  buttonStyle="solid"
                >
                  <Radio.Button style={{ marginRight: '20px' }} value={UpdateType.updateFile}>
                    Update Contract File
                  </Radio.Button>
                  <Radio.Button value={UpdateType.updateContractName}>Update The Contract Name Only</Radio.Button>
                </Radio.Group>
              </FormItem>
            ) : null
        }
        {
          !(isUpdate && isUpdateName) ? (
            <>
              <FormItem
                label={(
                  <span>
                    Contract Method&nbsp;
                    <Tooltip
                      title={methosTip}
                    >
                      <QuestionCircleOutlined className="main-color" />
                    </Tooltip>
                  </span>
                )}
                name="contractMethod"
                rules={[
                  {
                    required: true,
                    message: 'Please select a contract method!',
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                >
                  {
                    contractMethodList.map((v) => (
                      <Select.Option
                        key={v.methodType}
                        value={v.methodType}
                      >
                        {v.methodTitle}
                      </Select.Option>
                    ))
                  }
                </Select>
              </FormItem>
            </>
          ) : null
        }
        {
          contractMethodType.ProposeNewContract === contractMethod ? (
            <>
              {
              isUpdate
                ? (
                  <FormItem
                    label="Contract Address"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a contract address!',
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please select a contract address"
                      showSearch
                      optionFilterProp="children"
                      filterOption={contractFilter}
                      onChange={handleContractChange}
                    >
                      {
                        contractList.map((v) => (
                          <Select.Option
                            key={v.address}
                            value={v.address}
                          >
                            {v.contractName || v.address}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </FormItem>
                ) : null
              }
              {
                !isUpdate || isUpdate && isUpdateName ? (
                  <>
                    <FormItem
                      label="Contract Name"
                      name="name"
                      required={isUpdate && isUpdateName}
                      validateStatus={checkName?.validateStatus}
                      help={checkName?.errorMsg}
                    >
                      <Input
                        disabled={isUpdate && currentContractInfo.isSystemContract}
                        maxLength={150}
                      />
                    </FormItem>
                  </>
                ) : null
              }
              {
                !(isUpdateName && isUpdate) ? (
                  <>
                    <FormItem
                      label={(
                        <span>
                          Upload File&nbsp;
                          <Tooltip
                            // eslint-disable-next-line max-len
                            title="When creating a 'Contract Deployment' proposal, you only need to upload the file, more information can be viewed on the public proposal page after the application is successful"
                          >
                            <QuestionCircleOutlined className="main-color" />
                          </Tooltip>
                        </span>
                      )}
                      name="file"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      rules={
                      [
                        {
                          required: true,
                          message: 'Please upload the DLL or PATCHED file!',
                        },
                        {
                          validator: validateFile,
                        },
                      ]
                      }
                    >
                      <Upload
                        accept=".dll,.patched"
                        beforeUpload={() => false}
                        onChange={handleUpload}
                        extra="Support DLL or PATCHED file, less than 2MB"
                      >
                        <Button disabled={fileLength === 1}>
                          <UploadOutlined className="gap-right-small" />
                          Click to Upload
                        </Button>
                      </Upload>
                    </FormItem>
                  </>
                ) : null
              }
            </>
          ) : (
            <ProposalSearch selectMehtod={contractMethod} />
          )
        }
        <Form.Item {...tailFormItemLayout}>
          <Button
            shape="round"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Apply
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

ContractProposal.propTypes = {
  submit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ContractProposal;
