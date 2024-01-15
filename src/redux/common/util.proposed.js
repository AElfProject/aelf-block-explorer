/* eslint-disable consistent-return */

import AElf from "aelf-sdk";
import { request } from "../../common/request";
import { deserializeLog } from "../../common/utils";
import constants, { API_PATH } from "./constants";

const { DEFAUT_RPCSERVER } = constants;

const aelf = new AElf(new AElf.providers.HttpProvider(DEFAUT_RPCSERVER));

// const logList = [{
//   Address: "vcv1qewcsFN2tVWqLuu7DJ5wVFA8YEx5FFgCQBb1jMCbAQHxV",
//   Name: "ProposalReleased",
//   Indexed: [],
//   NonIndexed: "CiIKIL8udonDvjbE76sHFme7tY1hpeCoMs5kKmATewiqtfa7"
// }]

async function getProposalIndoData(proposalId) {
  return request(API_PATH.GET_PROPOSAL_INFO, proposalId, { method: "GET" });
}

export async function getTxInfo(txId) {
  return aelf.chain.getTxResult(txId);
}

export const getPreStepProposalId = async ({ logs, txId }) => {
  if (logs || txId) {
    const list = logs || (await getTxInfo(txId)).Logs;
    const log = (list || []).filter((v) => v.Name === "ProposalReleased");
    if (log.length === 0) {
      return;
    }
    const result = await deserializeLog(log[0], log[0].Name, log[0].Address);
    return result;
  }
  return "";
};

export const getCreatedTxIdOfProposal = async (proposalId) => {
  if (!proposalId) return "";
  try {
    const data = await getProposalIndoData(proposalId);
    const { proposal } = data;
    return proposal.createTxId || "";
  } catch (e) {
    return "";
  }
};

export const getProposedContractInputHash = async ({ logs, txId }) => {
  const list = logs || (await getTxInfo(txId)).Logs;
  const log = (list || []).filter((v) => v.Name === "ContractProposed");
  if (log.length === 0) {
    return "";
  }
  const result = await deserializeLog(log[0], log[0].Name, log[0].Address);
  return (result && result.proposedContractInputHash) || "";
};

export const getOriginProposedContractInputHash = async ({ txId }) => {
  const pid = await getPreStepProposalId({ txId });
  const createTxId = await getCreatedTxIdOfProposal(pid);
  return getProposedContractInputHash({ txId: createTxId });
};
// TODO TEST
// getPreStepProposalId({
//   txId:
//     '07a03111a654b6583b12e9c1f80c6aa809df0ef3e26cd22e6abd9596d3fbb343'
// }).then(id => {
//   getCreatedTxIdOfProposal(id).then(createId => getProposedContractInputHash({
//     txId: createId
//   }));
// });

// getProposedContractInputHash({
//   logs: [{
//     Address: "2UKQnHcQvhBT6X6ULtfnuh3b9PVRvVMEroHHkcK4YfcoH1Z1x2",
//     Name: "ContractProposed",
//     Indexed: [],
//     NonIndexed: "CiIKIHT7eii3w4tCYildoYVJJ4T2EVoqxGV/S3We3NszFJVp"
//   }]
// })
