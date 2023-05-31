/**
 * @file create proposal
 * @author atom-yang
 */
// eslint-disable-next-line no-use-before-define
import React, { useCallback, useState } from "react";
import AElf from "aelf-sdk";
import { Tabs, Modal, message } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  formatTimeToNano,
  getContractAddress,
  getTxResult,
  showTransactionResult,
  uint8ToBase64,
} from "@redux/common/utils";
import { useWebLogin } from "aelf-web-login";
import NormalProposal from "./NormalProposal";
import ContractProposal, { contractMethodType } from "./ContractProposal";
import {
  useCallbackAssem,
  useCallGetMethod,
  useReleaseApprovedContractAction,
  useReleaseCodeCheckedContractAction,
} from "./utils.callback";
import ContractProposalModal from "./ContractProposalModal";
import "./index.less";
import CopylistItem from "../../components/CopylistItem";
import {
  addContractName,
  getTransactionResult,
  updateContractName,
} from "../../utils";
import WithoutApprovalModal from "../../components/WithoutApprovalModal/index.tsx";
import { deserializeLog } from "../../../../common/utils";
import { interval } from "../../../../utils/timeUtils";
import { get } from "../../../../utils";
import { VIEWER_GET_CONTRACT_NAME } from "../../../../api/url";
import {
  base64ToByteArray,
  byteArrayToHexString,
  hexStringToByteArray,
} from "../../../../utils/formater";
import AddressNameVer from "../../components/AddressNameVer/index.tsx";

const { TabPane } = Tabs;

const initApplyModal = {
  visible: false,
  title: "",
  children: "",
};

// 10 minutes
const GET_CONTRACT_VERSION_TIMEOUT = 1000 * 60 * 10;

const CreateProposal = () => {
  const { orgAddress = "" } = useParams();
  const modifyData = useSelector((state) => state.proposalModify);
  const common = useSelector((state) => state.common);
  const proposalSelect = useSelector((state) => state.proposalSelect);
  const [normalResult, setNormalResult] = useState({
    isModalVisible: false,
    confirming: false,
  });
  const { contractSend } = useCallbackAssem();
  const { callGetMethodSend } = useCallGetMethod();
  const releaseApprovedContractHandler = useReleaseApprovedContractAction();
  const releaseCodeCheckedContractHandler =
    useReleaseCodeCheckedContractAction();
  const [contractResult, setContractResult] = useState({
    confirming: false,
  });
  const { aelf, wallet, currentWallet } = common;
  const [applyModal, setApplyModal] = useState(initApplyModal);
  const [withoutApprovalProps, setWithoutApprovalProps] = useState({});
  const [withoutApprovalOpen, setWithoutApprovalOpen] = useState(false);

  const { callContract } = useWebLogin();

  // open without approval modal
  const onOpenWithoutApprovalModal = (params) => {
    setWithoutApprovalProps(params);
    setWithoutApprovalOpen(true);
  };
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
    [proposalSelect]
  );

  const ReleaseCodeCheckedContractAction = useCallback(
    async (contract, isDeploy) => {
      const modalContent = await releaseCodeCheckedContractHandler(
        contract,
        isDeploy
      );

      setApplyModal(modalContent);
    },
    [proposalSelect]
  );

  const cancelWithoutApproval = () => {
    // to destroy sure modal
    Modal.destroyAll();
    setContractResult({
      confirming: false,
    });
    setWithoutApprovalOpen(false);
  };

  const ifToBeRelease = async (log) => {
    const startTime = new Date().getTime();
    let proposalId = "";
    if (log.length) {
      const result = await deserializeLog(log[0], log[0].Name, log[0].Address);
      proposalId = result.proposalId;
    }
    // start training in rotation 3s once
    // get proposal info
    return new Promise((resolve) => {
      try {
        interval(async () => {
          const endTIme = new Date().getTime();
          const proposalInfo = await callGetMethodSend(
            "Parliament",
            "GetProposal",
            {
              value: hexStringToByteArray(proposalId),
            }
          );
          if (proposalInfo === null || !!proposalInfo.toBeRelease) {
            interval.clear();
            resolve(true);
          }
          if (
            endTIme > proposalInfo?.expiredTime ||
            endTIme - startTime > GET_CONTRACT_VERSION_TIMEOUT
          ) {
            if (+proposalInfo?.approvalCount <= 0) {
              interval.clear();
              resolve("acs12 etc fail");
            } else {
              interval.clear();
              resolve(true);
            }
          }
        }, 3000);
      } catch (e) {
        interval.clear();
        message.error(e);
      }
    });
  };
  const openFailedWithoutApprovalModal = (isUpdate, transactionId) => {
    // exec fail modal
    onOpenWithoutApprovalModal({
      isUpdate,
      status: {
        verification: 1,
        execution: 3,
      },
      cancel: cancelWithoutApproval,
      title: `Contract deployment failed!`,
      message: (
        <div>
          <div>
            1. The contract code you deployed didn&apos;t pass the codecheck,
            possibly due to that it didn&apos;t implement methods in the ACS12
            contract, etc.
          </div>
          <div>
            2. Method fee and size fee payment failed due to insufficient
            balance.
          </div>
        </div>
      ),
      transactionId,
    });
  };
  // eslint-disable-next-line consistent-return
  const minedStatusWithoutApproval = async (name, txRes, isUpdate, address) => {
    try {
      const { Logs = [], TransactionId, codeHash } = txRes;
      const log = (Logs || []).filter((v) => v.Name === "ProposalCreated");
      const releaseRes = await ifToBeRelease(log, isUpdate, TransactionId);
      if (releaseRes === "acs12 etc fail") {
        openFailedWithoutApprovalModal(isUpdate, TransactionId);
        return Promise.reject(new Error("acs12 etc fail"));
      }
      // executing
      onOpenWithoutApprovalModal({
        isUpdate,
        status: {
          verification: 0,
          execution: 2,
        },
        cancel: cancelWithoutApproval,
      });
      if (isUpdate) {
        // already know contract address
        // get contractVersion
        const { contractVersion } = await callGetMethodSend(
          "Genesis",
          "GetContractInfo",
          address
        );
        const {
          data: { name: contractName },
        } = await get(VIEWER_GET_CONTRACT_NAME, { address });
        return {
          status: "success",
          contractAddress: address,
          contractName,
          contractVersion,
        };
      }
      const startTime = new Date().getTime();
      return new Promise((resolve) => {
        try {
          interval(async () => {
            const endTIme = new Date().getTime();
            // timeout
            if (endTIme - startTime > GET_CONTRACT_VERSION_TIMEOUT) {
              interval.clear();
              resolve({
                status: "fail",
              });
            } else {
              // get contract address
              const contractRegistration = await callGetMethodSend(
                "Genesis",
                "GetSmartContractRegistrationByCodeHash",
                {
                  value: hexStringToByteArray(codeHash),
                }
              );
              try {
                if (contractRegistration.contractAddress) {
                  // get contractVersion
                  const { contractAddress, contractVersion } =
                    contractRegistration;
                  // get contractName
                  const {
                    data: { name: contractName },
                  } = await get(VIEWER_GET_CONTRACT_NAME, {
                    address: contractAddress,
                  });
                  interval.clear();
                  resolve({
                    status: "success",
                    contractAddress,
                    contractName: contractName || name || "-1",
                    contractVersion,
                  });
                }
              } catch (e) {
                interval.clear();
                message.error(e.message);
              }
            }
          }, 10000);
        } catch (e) {
          interval.clear();
          message.error(e.message);
        }
      });
    } catch (e) {
      message.error(e.message);
    }
  };

  async function submitContract(contract) {
    const {
      isUpdate,
      address,
      action,
      name,
      file,
      isOnlyUpdateName,
      onSuccess,
      contractMethod,
      approvalMode,
    } = contract;
    let params = {};
    try {
      // bp and without approval, both process is below when onlyUpdateName.
      if (isOnlyUpdateName) {
        await updateContractName(currentWallet, {
          contractAddress: address,
          contractName: name,
          address: currentWallet.address,
        });
        message.success("Contract Name has been updated！");
        return;
      }
      switch (contractMethod) {
        case contractMethodType.ReleaseApprovedContract:
          await ReleaseApprovedContractAction(contract);
          return;
        case contractMethodType.ReleaseCodeCheckedContract:
          await ReleaseCodeCheckedContractAction(
            contract,
            action === "ProposeNewContract"
          );
          return;
        default:
          break;
      }
      if (
        action === "ProposeNewContract" ||
        action === "DeployUserSmartContract"
      ) {
        // deploy contract
        // category=0: contract is c#
        params = {
          category: "0",
          code: file,
        };
      } else {
        // update contract
        params = {
          address,
          code: file,
        };
      }
      if (approvalMode === "withoutApproval") {
        try {
          // deploying
          onOpenWithoutApprovalModal({
            isUpdate,
            status: {
              verification: 2,
              execution: 3,
            },
            cancel: cancelWithoutApproval,
          });
          // get transaction id
          const result = await contractSend(action, params);
          const byteArray = AElf.utils.sha256.array(
            base64ToByteArray(params.code)
          );
          // get codeHash from code
          const codeHash = byteArrayToHexString(byteArray);
          const txRes = await getTransactionResult(
            aelf,
            result?.TransactionId ||
              result?.result?.TransactionId ||
              result.transactionId ||
              ""
          );
          txRes.codeHash = codeHash;
          const {
            TransactionId: transactionId,
            Error: error,
            Status: status,
          } = txRes;
          // if pre-check fail
          if (status === "NODEVALIDATIONFAILED") {
            onOpenWithoutApprovalModal({
              isUpdate,
              transactionId,
              message: error,
              status: {
                verification: 1,
                execution: 3,
              },
              cancel: cancelWithoutApproval,
            });
          } else if (status === "FAILED") {
            // if balance is not enough
            openFailedWithoutApprovalModal(isUpdate, transactionId);
          } else if (status === "MINED") {
            // add contract name
            if (name && +name !== -1) {
              await addContractName(currentWallet, {
                contractName: name,
                txId: transactionId,
                action: isUpdate ? "UPDATE" : "DEPLOY",
                address: currentWallet.address,
              });
            }
            // if proposalInfo-tobeReleased is true, go to exec
            // if proposalInfo-tobeReleased is true then GetSmartContractRegistrationByCodeHash
            // start training in rotation 3s once
            //    if deploy success, can get contract address
            //    if deploy failed, if without approval modal close, open normal modal
            //    if without approval modal open, show exec failed
            // if proposalInfo-tobeReleased is false until 10min, failed deploying ACS12
            const minedRes = await minedStatusWithoutApproval(
              name,
              txRes,
              isUpdate,
              address
            );
            if (minedRes.status === "success") {
              const { contractAddress, contractName, contractVersion } =
                minedRes;
              // open modal
              onOpenWithoutApprovalModal({
                isUpdate,
                status: {
                  verification: 0,
                  execution: 0,
                },
                cancel: cancelWithoutApproval,
                message: (
                  <AddressNameVer
                    address={contractAddress}
                    name={contractName}
                    ver={contractVersion}
                  />
                ),
              });
            } else {
              // exec fail modal
              onOpenWithoutApprovalModal({
                isUpdate,
                status: {
                  verification: 0,
                  execution: 1,
                },
                cancel: cancelWithoutApproval,
                message:
                  "This may be due to the failure in transaction which can be vviewed via Transaction ID:",
                transactionId,
              });
            }
          }
        } catch (e) {
          console.error(e);
          message.error(e.message);
        }
        return;
      }
      const result = await contractSend(action, params);
      const txsId =
        result?.TransactionId ||
        result?.result?.TransactionId ||
        result.transactionId ||
        "";
      if (!txsId)
        throw new Error("Transaction failed. Please reinitiate this step.");
      let Log;
      let txResult;
      if (result.data) {
        // portkey sdk login
        txResult = result.data;
      } else {
        txResult = await getTxResult(aelf, txsId ?? "");
      }
      if (txResult.Error) {
        throw new Error(txResult.Error);
      }
      if (txResult.Status === "MINED") {
        // A transaction is said to be mined when it is included to the blockchain in a new block.
        const { Logs = [] } = txResult;
        const log = (Logs || []).filter((v) => v.Name === "ProposalCreated");
        if (log.length) {
          Log = await deserializeLog(log[0], log[0].Name, log[0].Address);
        }
      }
      const { proposalId } = Log ?? "";
      if (name && +name !== -1) {
        await addContractName(currentWallet, {
          contractName: name,
          txId:
            result?.TransactionId ||
            result?.result?.TransactionId ||
            result.transactionId ||
            "",
          action: action === "ProposeNewContract" ? "DEPLOY" : "UPDATE",
          address: currentWallet.address,
        });
      }
      setApplyModal({
        visible: true,
        title: proposalId
          ? "Proposal is created！"
          : "Proposal failed to be created！",
        children: (
          <div style={{ textAlign: "left" }}>
            {proposalId ? (
              <div>
                <CopylistItem
                  label="Proposal ID"
                  value={proposalId}
                  // href={`/proposalsDetail/${proposalId}`}
                />
              </div>
            ) : (
              "This may be due to transaction failure. Please check it via Transaction ID:"
            )}
            <CopylistItem
              label="Transaction ID"
              isParentHref
              value={txsId}
              href={`/tx/${txsId}`}
            />
          </div>
        ),
      });
    } catch (e) {
      console.error(e);
      message.error(
        (e.errorMessage || {}).message || e.message || e.msg || "Error happened"
      );
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
      className: "sure-modal-content",
      width: "720",
      cancelButtonProps: { type: "primary", ghost: true },
      title: (
        <div style={{ textAlign: "left" }}>
          {isOnlyUpdateName
            ? "Are you sure you want to update this contract name?"
            : "Are you sure you want to submit this application?"}
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

      const result = await callContract({
        contractAddress: getContractAddress(proposalType),
        methodName: "CreateProposal",
        args: {
          contractMethodName,
          toAddress,
          params: uint8ToBase64(decoded || []),
          expiredTime: formatTimeToNano(expiredTime),
          organizationAddress,
          proposalDescriptionUrl,
        },
      });
      showTransactionResult(result);
    } catch (e) {
      console.error(e);
      message.error(
        (e.errorMessage || {}).message || e.message || "Error happened"
      );
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
            contractAddress={
              orgAddress === modifyData.orgAddress
                ? getContractAddress(modifyData.proposalType)
                : ""
            }
            aelf={aelf}
            wallet={wallet}
            currentWallet={currentWallet}
            submit={handleNormalSubmit}
          />
        </TabPane>
        <TabPane tab="Deploy/Update Contract" key="contract">
          <ContractProposal
            loading={contractResult.confirming}
            submit={handleContractSubmit}
          />
        </TabPane>
      </Tabs>
      <Modal
        wrapClassName="create-proposal-modal"
        title="Are you sure create this new proposal?"
        width={720}
        visible={normalResult.isModalVisible}
        confirmLoading={normalResult.confirming}
        onOk={submitNormalResult}
        onCancel={handleCancel}
      >
        <div className="proposal-result-list">
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Proposal Type:</span>
            <span className="proposal-result-list-item-value text-ellipsis">
              {normalResult.proposalType}
            </span>
          </div>
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Organization Address:</span>
            <span className="proposal-result-list-item-value text-ellipsis">
              {normalResult.organizationAddress}
            </span>
          </div>
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Contract Address:</span>
            <span className="proposal-result-list-item-value text-ellipsis">
              {normalResult.toAddress}
            </span>
          </div>
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Contract Method:</span>
            <span className="proposal-result-list-item-value text-ellipsis">
              {normalResult.contractMethodName}
            </span>
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
              rel="noopener noreferrer"
            >
              {normalResult.proposalDescriptionUrl}
            </a>
          </div>
          <div className="proposal-result-list-item gap-bottom">
            <span className="sub-title gap-right">Expiration Time:</span>
            <span className="proposal-result-list-item-value text-ellipsis">
              {normalResult.expiredTime &&
                normalResult.expiredTime.format("YYYY/MM/DD HH:mm:ss")}
            </span>
          </div>
        </div>
      </Modal>
      <ContractProposalModal
        contractModalCancle={contractModalCancle}
        applyModal={applyModal}
      />
      <WithoutApprovalModal
        open={withoutApprovalOpen}
        withoutApprovalProps={withoutApprovalProps}
      />
    </div>
  );
};

export default CreateProposal;
