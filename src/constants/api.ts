import { get } from 'utils/axios';
const BASE_URL = 'https://explorer-test.aelf.io/chain/api/';
const BASE_URL_TDVW = 'https://explorer-test-tdvw.aelf.io/chain/api/';
const ALL_BLOCKS_API_URL = '/all/blocks';
const ALL_UNCONFIRMED_BLOCKS_API_URL = '/all/unconfirmedBlocks';
const ALL_TXS_API_URL = '/all/transactions';
const ALL_UNCONFIRMED_TXS_API_URL = '/all/unconfirmedTransactions';
const TXS_BLOCK_API_URL = '/block/transactions';
const TXS_INFO_API_URL = '/block/txInfo';
const BLOCK_INFO_API_URL = '/block/blockInfo';
const ADDRESS_TXS_API_URL = '/address/transactions';
const ADDRESS_BALANCE_API_URL = '/api/address/balance';
const VIEWER_GET_ALL_TOKENS = '/viewer/getAllTokens';
const TPS_LIST_API_URL = '/tps/all';
const ADDRESS_TOKENS_API_URL = '/address/tokens';
const ELF_REALTIME_PRICE_URL = 'https://min-api.cryptocompare.com/data/price?fsym=ELF&tsyms=USD,BTC,CNY';
const HISTORY_PRICE = '/token/price-history';
const ELF_REST_TRADE_API = 'https://www.bcex.top/Api_Market/getCoinTrade';
const RESOURCE_REALTIME_RECORDS = '/resource/realtime-records';
const RESOURCE_TURNOVER = '/resource/turnover';
const RESOURCE_RECORDS = '/resource/records';
const SOCKET_URL = '/socket';
const SOCKET_URL_NEW = '/new-socket';
const BASIC_INFO = '/chain-info';
export const fetchCurrentMinerList = (contract: any) => contract.GetCurrentMinerList.call();
export const fetchCurrentMinerPubkeyList = (contract: any) => contract.GetCurrentMinerPubkeyList.call();
export const getAllTeamDesc = () =>
  get('/vote/getAllTeamDesc', {
    isActive: true,
  });
export const getTeamDesc = (publicKey: any) =>
  get('/vote/getTeamDesc', {
    publicKey,
  });
export const fetchPageableCandidateInformation = (contract: any, payload: any) =>
  contract.GetPageableCandidateInformation.call(payload);
export const fetchElectorVoteWithRecords = (contract: any, payload: any) =>
  contract.GetElectorVoteWithRecords.call(payload);
export {
  BASE_URL,
  BASE_URL_TDVW,
  ALL_BLOCKS_API_URL,
  ALL_UNCONFIRMED_BLOCKS_API_URL,
  ALL_TXS_API_URL,
  ALL_UNCONFIRMED_TXS_API_URL,
  TXS_BLOCK_API_URL,
  ADDRESS_TXS_API_URL,
  VIEWER_GET_ALL_TOKENS,
  ADDRESS_TOKENS_API_URL,
  TPS_LIST_API_URL,
  ELF_REALTIME_PRICE_URL,
  ELF_REST_TRADE_API,
  RESOURCE_REALTIME_RECORDS,
  RESOURCE_TURNOVER,
  RESOURCE_RECORDS,
  SOCKET_URL,
  SOCKET_URL_NEW,
  BASIC_INFO,
  TXS_INFO_API_URL,
  BLOCK_INFO_API_URL,
  ADDRESS_BALANCE_API_URL,
  HISTORY_PRICE,
};
