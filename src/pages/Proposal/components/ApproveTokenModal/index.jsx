/**
 * @file approve token modal
 */
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Decimal from "decimal.js";
import { Form, InputNumber, message, Modal, Button } from "antd";
import {
  getContractAddress,
  getTxResult,
  showTransactionResult,
} from "../../common/utils";
import { getContract } from "../../../../common/utils";
import constants from "../../common/constants";
import "./index.less";

const FormItem = Form.Item;

const { proposalActions } = constants;

async function getTokenDecimal(aelf, symbol) {
  try {
    const token = await getContract(aelf, getContractAddress("Token"));
    const result = await token.GetTokenInfo.call({
      symbol,
    });
    return result.decimals || 8;
  } catch (e) {
    console.error(e);
    return 8;
  }
}

async function getBalance(aelf, symbol, owner) {
  try {
    const token = await getContract(aelf, getContractAddress("Token"));
    const result = await token.GetBalance.call({
      symbol,
      owner,
    });
    return result.balance || 0;
  } catch (e) {
    console.error(e);
    return 8;
  }
}

async function getAllowance(aelf, params) {
  try {
    const token = await getContract(aelf, getContractAddress("Token"));
    const result = await token.GetAllowance.call(params);
    return result.allowance || 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
}

async function getVirtualAddress(aelf, proposalId) {
  try {
    const referendum = await getContract(
      aelf,
      getContractAddress("Referendum")
    );
    return referendum.GetProposalVirtualAddress.call(proposalId);
  } catch (e) {
    message.error(`failed to get virtual address of proposal ${proposalId}`);
    throw e;
  }
}

async function getProposalAllowanceInfo(aelf, proposalId, owner, symbol) {
  const [spender, decimals] = await Promise.all([
    getVirtualAddress(aelf, proposalId),
    getTokenDecimal(aelf, symbol),
  ]);
  const [allowance, balance] = await Promise.all([
    getAllowance(aelf, {
      spender,
      symbol,
      owner,
    }),
    getBalance(aelf, symbol, owner),
  ]);
  return {
    spender,
    allowance: new Decimal(allowance).dividedBy(`1e${decimals}`).toNumber(),
    decimals,
    balance: new Decimal(balance).dividedBy(`1e${decimals}`).toNumber(),
  };
}

const formItemLayout = {
  layout: "inline",
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

const sendTransaction = async (wallet, contractAddress, method, param) => {
  const result = await wallet.invoke({
    contractAddress,
    param,
    contractMethod: method,
  });
  showTransactionResult(result);
  return result;
};

function getFormDesc(allowance) {
  return {
    amount: {
      name: "amount",
      initialValue: allowance,
      rules: [
        {
          required: true,
          message: "Please input the amount",
        },
        {
          type: "number",
          validator(rule, value) {
            return value > 0
              ? Promise.resolve()
              : Promise.reject(new Error("Value must be larger than 0"));
          },
        },
      ],
    },
  };
}

function getOkProps(loadings, allowanceInfo, inputAmount) {
  return {
    loading: loadings.actionLoading || loadings.tokenLoading,
    disabled:
      loadings.tokenLoading ||
      +allowanceInfo.allowance === 0 ||
      inputAmount !== 0,
  };
}

const ApproveTokenModal = (props) => {
  const {
    action,
    aelf,
    onCancel,
    onConfirm,
    visible,
    wallet,
    tokenSymbol,
    proposalId,
    owner,
  } = props;
  const [form] = Form.useForm();
  const { validateFields } = form;
  const [allowanceInfo, setAllowanceInfo] = useState({
    decimals: 8,
    allowance: 0,
    balance: 0,
    spender: "",
  });
  const [inputAmount, setInputAmount] = useState(0);
  const [loadings, setLoadings] = useState({
    tokenLoading: true,
    actionLoading: true,
  });
  const formDesc = useMemo(
    () => getFormDesc(allowanceInfo.allowance),
    [allowanceInfo]
  );

  const okProps = useMemo(
    () => getOkProps(loadings, allowanceInfo, inputAmount),
    [loadings, allowanceInfo, inputAmount]
  );

  useEffect(() => {
    if (visible) {
      getProposalAllowanceInfo(aelf, proposalId, owner, tokenSymbol)
        .then((res) => {
          setLoadings({
            tokenLoading: false,
            actionLoading: false,
          });
          setAllowanceInfo(res);
          form.setFieldsValue({
            amount: res.allowance,
          });
        })
        .catch((err) => {
          setLoadings({
            tokenLoading: false,
            actionLoading: false,
          });
          console.error(err);
          message.error(err.message || "Network Error");
        });
    }
  }, [visible, tokenSymbol, proposalId, owner]);

  function handleCancel() {
    onCancel();
  }

  async function handleOk() {
    setLoadings({
      ...loadings,
      actionLoading: true,
    });
    onConfirm(action);
  }

  async function handleStake() {
    try {
      const results = await validateFields();
      let { amount } = results;
      const { spender, decimals } = allowanceInfo;
      amount = new Decimal(amount - allowanceInfo.allowance)
        .mul(`1e${decimals}`)
        .toString();
      setLoadings({
        tokenLoading: true,
        actionLoading: false,
      });
      const method = amount > 0 ? "Approve" : "UnApprove";
      amount = Math.abs(amount);
      const result = await sendTransaction(
        wallet,
        getContractAddress("Token"),
        method,
        {
          spender,
          amount,
          symbol: tokenSymbol,
        }
      );
      const txId = result.TransactionId || result.result.TransactionId;
      const txResult = await getTxResult(aelf, txId, 0, 6000);
      message.info(`Transactions ${txId} is ${txResult.Status}`);
      getProposalAllowanceInfo(aelf, proposalId, owner, tokenSymbol)
        .then((res) => {
          setAllowanceInfo(res);
          setInputAmount(0);
          setLoadings({
            actionLoading: false,
            tokenLoading: false,
          });
          form.setFieldsValue({
            amount: res.allowance,
          });
        })
        .catch((err) => {
          message.error(err.message || "Network Error");
        });
    } catch (e) {
      setLoadings({
        actionLoading: false,
        tokenLoading: false,
      });
      console.error(e);
      message.error(e.message || "Send Transaction failed");
    }
  }

  function handleValueChange({ amount }) {
    setInputAmount(amount - allowanceInfo.allowance);
  }

  return (
    <Modal
      wrapClassName='approve-token-modal'
      title={action}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={action}
      okButtonProps={okProps}
      destroyOnClose
      width={720}
    >
      <div className='gap-bottom-large'>
        Token Balance: {allowanceInfo.balance} {tokenSymbol}
      </div>
      <Form
        form={form}
        className='approve-token-form'
        {...formItemLayout}
        onValuesChange={handleValueChange}
      >
        <FormItem label='Staked Token'>
          <FormItem noStyle {...formDesc.amount}>
            <InputNumber precision={allowanceInfo.decimals} step={1} min={0} />
          </FormItem>
          <span className='gap-left-small'>{tokenSymbol}</span>
        </FormItem>
        <FormItem colon={false}>
          <Button
            type='primary'
            loading={loadings.tokenLoading}
            disabled={allowanceInfo.balance === 0 || inputAmount === 0}
            onClick={handleStake}
          >
            Stake
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

ApproveTokenModal.propTypes = {
  action: PropTypes.oneOf(Object.values(proposalActions)).isRequired,
  aelf: PropTypes.shape({
    chain: PropTypes.object,
  }).isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  wallet: PropTypes.shape({
    invoke: PropTypes.func,
  }).isRequired,
  owner: PropTypes.string.isRequired,
  proposalId: PropTypes.string.isRequired,
};

export default ApproveTokenModal;
