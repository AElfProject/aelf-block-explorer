const RESOURCE_OPERATE_LIMIT = 0.01;
const LOG_STATUS = {
  LOGGED: 'logged',
  LOG_OUT: 'log_out',
};

const LOADING_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILED: 'failed',
};
const TXSSTATUS = {
  // NotExisted: '不存在',
  // Pending: '交易中',
  // Failed: '失败',
  // Mined: '成功',
  NotExisted: 'NotExisted',
  Pending: 'Pending',
  Failed: 'Failed',
  Mined: 'Mined',
};

const txStatusInUpperCase = {
  // NotExisted: '不存在',
  // Pending: '交易中',
  // Failed: '失败',
  // Mined: '成功',
  notExisted: 'NOT_EXISTED',
  pending: 'PENDING',
  failed: 'FAILED',
  mined: 'MINED',
};
const IE_ADVICE = "We recommend using Chrome/Safari/Firefox to view our page. In recent time we don't support IE!";
const INPUT_STARTS_WITH_MINUS_TIP = "Input can't starts with minus symbol!";
const INPUT_ZERO_TIP = "Input can't be 0!";
const BALANCE_LESS_THAN_OPERATE_LIMIT_TIP = `Your balance is less than the operate limit ${RESOURCE_OPERATE_LIMIT}`;
const OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP = 'Your operating number is too small.';
const BUY_OR_SELL_MORE_THAN_ASSETS_TIP = 'Buy or sell more than available assets';
const BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP =
  'Please purchase or sell a smaller amount of resources than the inventory in the resource contract.';
const TRANSACT_LARGE_THAN_ZERO_TIP = 'You should transact an amount large than 0.';
const ONLY_POSITIVE_FLOAT_OR_INTEGER_TIP = 'Only support positive float and integer.';
const CHECK_BALANCE_TIP = 'Please Check your balance Then.';
const BUY_MORE_THAN_HALT_OF_INVENTORY_TIP = 'Sorry, you can not buy so many resources in one time.';
const INPUT_NUMBER_TIP = 'Your should input a number';
const BETWEEN_ZEOR_AND_BALANCE_TIP = 'Too large value';
const SELECT_SOMETHING_TIP = 'Please select something to continue';
const NEED_PLUGIN_AUTHORIZE_TIP = "Need plugin's authorization.";
const UNKNOWN_ERROR_TIP = 'Sorry, it seems that we encountered an unknown error.';
const NO_AUTHORIZATION_ERROR_TIP = "Sorry, you temporarily don't has the authorization to the page.";
const INPUT_SOMETHING_TIP = 'Sorry, you should input something';
const INTEGER_TIP = 'It can only be integer';
const UNLOCK_PLUGIN_TIP = 'Your plugin has beed locked, please unlock and refresh the page';
const GET_TIP = 'It can only be integer';
const ALREADY_BEEN_CURRENT_CANDIDATE_TIP = 'You already been candidate';
const NOT_CURRENT_CANDIDATE_TIP =
  'Sorry, the node is not current candidate \n Please refresh the page then choose another node to vote.';
const THE_REASON_TO_BECOME_A_NON_CANDIDATE =
  'It may be result from: \n 1. The node has quited election during the time. \n 2. The node became an evil node then was kicked out of the candidates.';
const FEE_TIP = 'A bit fee of ELF will be deducted from the operation';
const ELECTION_NOTIFI_DATA_TIP =
  'The election term is 7 days, there is no interval between terms; the number of nodes is the total number of current production nodes and candidate nodes; the number of votes is the sum of the votes amount since the election started; the reward pool includes a block reward of the production nodes, 90% of the transaction fee and 50% of the resource tokens transaction fee.';
const MY_VOTE_DATA_TIP =
  'The Total Votes is the votes amount you voted, and the Redeemable Votes is the number of votes that has expired.';
const GET_NULL = "Cannot read property 'error' of null";
const FEE_RATE = 0.005;
const FAILED_MESSAGE_DISPLAY_TIME = 20; // seconds
const SHORTEST_LOCK_TIME = 90; // day
export {
  LOG_STATUS,
  LOADING_STATUS,
  GET_TIP,
  TXSSTATUS,
  txStatusInUpperCase,
  IE_ADVICE,
  INPUT_STARTS_WITH_MINUS_TIP,
  INPUT_ZERO_TIP,
  BALANCE_LESS_THAN_OPERATE_LIMIT_TIP,
  OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP,
  BUY_OR_SELL_MORE_THAN_ASSETS_TIP,
  BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP,
  TRANSACT_LARGE_THAN_ZERO_TIP,
  ONLY_POSITIVE_FLOAT_OR_INTEGER_TIP,
  CHECK_BALANCE_TIP,
  BUY_MORE_THAN_HALT_OF_INVENTORY_TIP,
  INPUT_NUMBER_TIP,
  BETWEEN_ZEOR_AND_BALANCE_TIP,
  SELECT_SOMETHING_TIP,
  NEED_PLUGIN_AUTHORIZE_TIP,
  UNKNOWN_ERROR_TIP,
  NO_AUTHORIZATION_ERROR_TIP,
  INPUT_SOMETHING_TIP,
  INTEGER_TIP,
  UNLOCK_PLUGIN_TIP,
  ALREADY_BEEN_CURRENT_CANDIDATE_TIP,
  NOT_CURRENT_CANDIDATE_TIP,
  ELECTION_NOTIFI_DATA_TIP,
  MY_VOTE_DATA_TIP,
  THE_REASON_TO_BECOME_A_NON_CANDIDATE,
  FEE_TIP,
  GET_NULL,
  RESOURCE_OPERATE_LIMIT,
  FEE_RATE,
  FAILED_MESSAGE_DISPLAY_TIME,
  SHORTEST_LOCK_TIME,
};
