/**
 * @file config
 * @author atom-yang
 */
import config from './config/viewer/config.json';
export const API_PATH = {
  GET_ALL_CONTRACTS: '/api/viewer/allContracts',
  GET_PROPOSAL_LIST: '/api/proposal/list',
  GET_PROPOSAL_INFO: '/api/proposal/proposalInfo',
  CHECK_CONTRACT_NAME: '/api/proposal/checkContractName',
  ADD_CONTRACT_NAME: '/api/proposal/addContractName',
  UPDATE_CONTRACT_NAME: '/api/proposal/updateContractName',
  GET_AUDIT_ORGANIZATIONS: '/api/proposal/auditOrganizations',
  GET_ORGANIZATIONS: '/api/proposal/organizations',
  GET_VOTED_LIST: '/api/proposal/votedList',
  GET_PERSONAL_VOTED_LIST: '/api/proposal/personalVotedList',
  GET_CONTRACT_NAME: '/api/viewer/getContractName',
  GET_AUDIT_ORG_BY_PAGE: '/api/proposal/auditOrganizationsByPage',
  GET_ORG_OF_OWNER: '/api/proposal/orgOfOwner',
  GET_APPLIED_PROPOSALS: '/api/proposal/appliedList',
  GET_ALL_PERSONAL_VOTES: '/api/proposal/allPersonalVotes',
  GET_TRANSACTION_BY_ADDRESS: '/api/address/transactions',
  GET_ALL_CONTRACT_NAME: '/api/viewer/allContracts',
  GET_BALANCES_BY_ADDRESS: '/api/viewer/balances',
  GET_ACCOUNT_LIST: '/api/viewer/accountList',
  GET_TOKEN_LIST: '/api/proposal/tokenList',
  GET_ALL_TOKENS: '/api/viewer/getAllTokens',
  GET_TOKENS_TRANSACTION: '/api/viewer/tokenTxList',
  GET_TOKEN_INFO: '/api/viewer/tokenInfo',
  GET_EVENT_LIST: '/api/viewer/eventList',
  GET_TRANSFER_LIST: '/api/viewer/transferList',
  GET_LIST: '/api/viewer/list',
  GET_FILES: '/api/viewer/getFile',
  GET_HISTORY: '/api/viewer/history',
};
export default {
  ...config,
  API_PATH,
};
