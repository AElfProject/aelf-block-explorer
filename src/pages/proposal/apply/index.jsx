/**
 * @file create proposal
 * @author atom-yang
 */
import React, { useCallback, useState } from 'react';
import { Tabs, Modal, message } from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import NormalProposal from './NormalProposal';
import ContractProposal, { contractMethodType } from './ContractProposal';
require('./index.less');
import {
  addContractName,
  getDeserializeLog,
  updateContractName,
  formatTimeToNano,
  getContractAddress,
  showTransactionResult,
  uint8ToBase64,
} from 'page-components/Proposal/common/utils';
import CopylistItem from 'page-components/Proposal/CopylistItem';
import {
  useCallbackAssem,
  useReleaseApprovedContractAction,
  useReleaseCodeCheckedContractAction,
} from './utils.callback';
import ContractProposalModal from './ContractProposalModal';

const { TabPane } = Tabs;

const initApplyModal = {
  visible: false,
  title: '',
  children: '',
};

const CreateProposal = () => {
  const { orgAddress = '' } = useRouter().query;
  const modifyData = useSelector((state) => {
    return state.proposalModify;
  });
  const common = useSelector((state) => state.common);
  const proposalSelect = useSelector((state) => state.proposalSelect);
  const [normalResult, setNormalResult] = useState({
    isModalVisible: false,
    confirming: false,
  });
  const { contractSend } = useCallbackAssem();
  const releaseApprovedContractHandler = useReleaseApprovedContractAction();
  const releaseCodeCheckedContractHandler = useReleaseCodeCheckedContractAction();
  const [contractResult, setContractResult] = useState({
    confirming: false,
  });
  const { aelf, wallet, currentWallet } = common;
  const [applyModal, setApplyModal] = useState(initApplyModal);

  const handleCancel = () => {
    if (normalResult.isModalVisible) {
      setNormalResult({
        ...normalResult,
        isModalVisible: false,
        confirming: false,
      });
    }
    if (contractResult.isModalVisible) {
      setContractResult({
        ...contractResult,
        confirming: false,
      });
    }
  };

  function handleNormalSubmit(results) {
    setNormalResult({
      ...normalResult,
      ...results,
      isModalVisible: true,
      confirming: false,
    });
  }

  const ReleaseApprovedContractAction = useCallback(
    async (contract) => {
      const modalContent = await releaseApprovedContractHandler(contract);
      setApplyModal(modalContent);
    },
    [proposalSelect],
  );

  const ReleaseCodeCheckedContractAction = useCallback(
    async (contract, isDeploy) => {
      const modalContent = await releaseCodeCheckedContractHandler(contract, isDeploy);

      setApplyModal(modalContent);
    },
    [proposalSelect],
  );

  async function submitContract(contract) {
    const { address, action, name, file, isOnlyUpdateName, onSuccess, contractMethod } = contract;
    let params = {};

    try {
      if (isOnlyUpdateName) {
        await updateContractName(wallet, currentWallet, {
          contractAddress: address,
          contractName: name,
          address: currentWallet.address,
        });
        message.success('Contract Name has been updated！');
        return;
      }
      switch (contractMethod) {
        case contractMethodType.ReleaseApprovedContract:
          await ReleaseApprovedContractAction(contract);
          return;
        case contractMethodType.ReleaseCodeCheckedContract:
          await ReleaseCodeCheckedContractAction(contract, action === 'ProposeNewContract');
          return;
        default:
          break;
      }
      if (action === 'ProposeNewContract') {
        params = {
          category: '0',
          code: file,
        };
      } else {
        params = {
          address,
          code: file,
        };
      }
      const result = await contractSend(action, params);
      const Log = await getDeserializeLog(
        aelf,
        result?.TransactionId || result?.result?.TransactionId || '',
        'ProposalCreated',
      );
      const { proposalId } = Log ?? '';
      if (name && +name !== -1) {
        await addContractName(wallet, currentWallet, {
          contractName: name,
          txId: result.TransactionId || result.result.TransactionId,
          action: action === 'ProposeNewContract' ? 'DEPLOY' : 'UPDATE',
          address: currentWallet.address,
        });
      }
      setApplyModal({
        visible: true,
        title: proposalId ? 'Proposal is created！' : 'Proposal failed to be created！',
        children: (
          <div style={{ textAlign: 'left' }}>
            {proposalId ? (
              <CopylistItem
                label="Proposal ID："
                value={proposalId}
                // href={`/proposalsDetail/${proposalId}`}
              />
            ) : (
              'This may be due to transaction failure. Please check it via Transaction ID:'
            )}
            <CopylistItem
              label="Transaction ID："
              isParentHref
              value={result?.TransactionId || result?.result?.TransactionId || ''}
              href={`/tx/${result?.TransactionId || result?.result?.TransactionId || ''}`}
            />
          </div>
        ),
      });
    } catch (e) {
      console.error(e);
      message.error((e.errorMessage || {}).message || e.message || e.msg || 'Error happened');
    } finally {
      if (onSuccess) onSuccess();
      setContractResult({
        ...contract,
        confirming: false,
      });
    }
  }

  function handleContractSubmit(results) {
    setContractResult({
      ...contractResult,
      ...results,
      confirming: true,
    });
    const { isOnlyUpdateName } = results;
    Modal.confirm({
      title: (
        <div style={{ textAlign: 'left' }}>
          {isOnlyUpdateName
            ? 'Are you sure you want to update this contract name?'
            : 'Are you sure you want to submit this application?'}
        </div>
      ),
      icon: null,
      onOk: () => submitContract(results),
      onCancel: () => {
        setContractResult((v) => ({ ...v, confirming: false }));
        handleCancel();
      },
    });
  }

  async function submitNormalResult() {
    setNormalResult({
      ...normalResult,
      confirming: true,
    });
    try {
      const {
        expiredTime,
        contractMethodName,
        toAddress,
        proposalType,
        organizationAddress,
        proposalDescriptionUrl,
        params: { decoded },
      } = normalResult;
      const result = await wallet.invoke({
        contractAddress: getContractAddress(proposalType),
        param: {
          contractMethodName,
          toAddress,
          params: uint8ToBase64(decoded || []),
          expiredTime: formatTimeToNano(expiredTime),
          organizationAddress,
          proposalDescriptionUrl,
        },
        contractMethod: 'CreateProposal',
      });
      showTransactionResult(result);
    } catch (e) {
      console.error(e);
      message.error((e.errorMessage || {}).message || e.message || 'Error happened');
    } finally {
      setNormalResult({
        ...normalResult,
        confirming: false,
        isModalVisible: false,
      });
    }
  }

  const contractModalCancle = useCallback(async () => {
    setApplyModal(initApplyModal);
  }, []);

  return (
    <div className="proposal-apply">
      <Tabs className="proposal-apply-tab" defaultActiveKey="normal">
        <TabPane tab="Ordinary Proposal" key="normal">
          <NormalProposal
            isModify={orgAddress === modifyData.orgAddress}
            {...(orgAddress === modifyData.orgAddress ? modifyData : {})}
            contractAddress={orgAddress === modifyData.orgAddress ? getContractAddress(modifyData.proposalType) : ''}
            aelf={aelf}
            wallet={wallet}
            currentWallet={currentWallet}
            submit={handleNormalSubmit}
          />
        </TabPane>
        <TabPane tab="Deploy/Update Contract" key="contract">
          <ContractProposal loading={contractResult.confirming} submit={handleContractSubmit} />
        </TabPane>
      </Tabs>
      <Modal
        wrapClassName="create-proposal-modal"
        title="Are you sure create this new proposal?"
        width={720}
        visible={normalResult.isModalVisible}
        confirmLoading={normalResult.confirming}
        onOk={submitNormalResult}
        onCancel={handleCancel}>
        <div className="proposal-result-list">
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Proposal Type:</span>
            <span className="proposal-result-list-item-value text-ellipsis">{normalResult.proposalType}</span>
          </div>
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Organization Address:</span>
            <span className="proposal-result-list-item-value text-ellipsis">{normalResult.organizationAddress}</span>
          </div>
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Contract Address:</span>
            <span className="proposal-result-list-item-value text-ellipsis">{normalResult.toAddress}</span>
          </div>
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Contract Method:</span>
            <span className="proposal-result-list-item-value text-ellipsis">{normalResult.contractMethodName}</span>
          </div>
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Contract Params:</span>
            <pre className="proposal-result-list-item-value">
              {JSON.stringify((normalResult.params || {}).origin, null, 2)}
            </pre>
          </div>
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Description URL:</span>
            <a
              href={normalResult.proposalDescriptionUrl}
              className="proposal-result-list-item-value text-ellipsis"
              target="_blank"
              rel="noopener noreferrer">
              {normalResult.proposalDescriptionUrl}
            </a>
          </div>
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Expiration Time:</span>
            <span className="proposal-result-list-item-value text-ellipsis">
              {normalResult.expiredTime && normalResult.expiredTime.format('YYYY/MM/DD HH:mm:ss')}
            </span>
          </div>
        </div>
      </Modal>
      <ContractProposalModal contractModalCancle={contractModalCancle} applyModal={applyModal} />
    </div>
  );
};

export default CreateProposal;
