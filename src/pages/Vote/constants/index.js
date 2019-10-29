/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 19:43:55
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-29 19:53:04
 * @Description: The constants used in Vote pages
 */
import { thousandsComma } from '@utils/formater';
// todo: handle the code as follow
import { LOWER_SYMBOL } from '@src/constants';
import { ELF_DECIMAL } from '@config/config';

//  The contracts need to load in page ElectionNotification
const contractsNeedToLoad = [
  {
    contractAddrValName: 'consensusContractAddr',
    contractNickname: 'consensusContract'
  },
  {
    contractAddrValName: 'dividendContractAddr',
    contractNickname: 'dividendContract'
  },
  {
    contractAddrValName: 'multiTokenContractAddr',
    contractNickname: 'multiTokenContract'
  },
  {
    contractAddrValName: 'voteContractAddr',
    contractNickname: 'voteContract'
  },
  {
    contractAddrValName: 'electionContractAddr',
    contractNickname: 'electionContract'
  },
  {
    contractAddrValName: 'profitContractAddr',
    contractNickname: 'profitContract'
  }
];

const contractsNeedToLoadFromExt = [
  {
    contractAddrValName: 'electionContractAddr',
    contractNickname: 'electionContractFromExt'
  },
  {
    contractAddrValName: 'profitContractAddr',
    contractNickname: 'profitContractFromExt'
  }
];

const myVoteStatisData = {
  myTotalVotesAmount: {
    title: `Total Votes (${LOWER_SYMBOL})`
  },
  // myVoteProfit: {
  //   title: `投票收益(${LOWER_SYMBOL})`
  // },
  withdrawnableVotesAmount: {
    title: `Redeemable Votes (${LOWER_SYMBOL})`
  }
};

const HARDWARE_ADVICE = '8Core 16GB 5TB Bandwidth 100Mbps';

const ELECTION_MORTGAGE_NUM = 100000;
const ELECTION_MORTGAGE_NUM_STR = thousandsComma(ELECTION_MORTGAGE_NUM);
const A_NUMBER_LARGE_ENOUGH_TO_GET_ALL = 100000;

const urlRegExp = new RegExp(
  '^(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i'
);

const okRegExp = /^2\d{2}$/;

// 14, 56节点
const schemeIds = [
  {
    type: 'CitizenWelfare',
    schemeId: '2623eb0b2decec194c25388195e92592402fe66bdc3657ceadaf58d92860186a'
  },
  {
    type: 'BackupSubsidy',
    schemeId: '208d098067699730d220f1997d48c8b8d8881bb8507abfad1b07d9af8ba94bb0'
  },
  {
    type: 'VotesWeightReward',
    schemeId: '9a7f406cf485dd91439c848dea23b5c03029aee63cd8077710ca05865f73ed99'
  },
  {
    type: 'MinerBasicReward',
    schemeId: '58c0ee2b5eab330cafa5df680399a6374c7e86bbbcabeda0b70eb0a98a4f788a'
  },
  {
    type: 'ReElectionReward',
    schemeId: '291c0cc8fd51e02c02cb95c235f8d41a14793f8e8bf4810e3e44aaf89e7c3389'
  }
];

// todo: move the scheme ids to config.js
// 不删档节点
// const schemeIds = [
//   {
//     type: 'CitizenWelfare',
//     schemeId: '457591785dfc352215fa1c443dc7af361ddcfa8873e010fbde696336c38d2a39'
//   },
//   {
//     type: 'BackupSubsidy',
//     schemeId: '4c7c79c9ba20f4e04d52676bcd301a21bb817457150991065bb6e850dd18dd43'
//   },
//   {
//     type: 'VotesWeightReward',
//     schemeId: 'aa3c3e97cedf5bdee9725fed244ab55046eca81e7d2831a587f4b6c543282cbb'
//   },
//   {
//     type: 'MinerBasicReward',
//     schemeId: 'a38eb0fc685ef62f7b83001fb6e3cc0e07d7d77facadb2911754d7f6c0f308b5'
//   },
//   {
//     type: 'ReElectionReward',
//     schemeId: '5b7ab6879d4599911e0f2bd1dc151ea3a148ecb38e28ea3c2dc25f0d36646c01'
//   }
// ];

const FROM_WALLET = 'fromWallet';
const FROM_EXPIRED_VOTES = 'fromExpiredVotes';
const FROM_ACTIVE_VOTES = 'fromActiveVotes';
const NODE_DEFAULT_NAME = 'Default';

const voteTypeFormItemsMap = {
  [FROM_WALLET]: ['voteAmount', 'lockTime'],
  [FROM_EXPIRED_VOTES]: ['voteFromExpiredVoteAmount', 'lockTime'],
  [FROM_ACTIVE_VOTES]: ['nodeName', 'nodeAddress', 'switchVoteAmount']
};

// When the team I voted is not candidate in current term, use the symbol to display.
const RANK_NOT_EXISTED_SYMBOL = '-';

const routePaths = {
  vote: '/vote',
  electionNotifi: '/vote/election',
  applyToBeANode: '/vote/apply',
  teamInfoKeyin: '/vote/apply/keyin',
  teamDetail: '/vote/team',
  myVote: '/vote/myvote'
};

export {
  contractsNeedToLoad,
  contractsNeedToLoadFromExt,
  electionNotifiStatisData,
  myVoteStatisData,
  HARDWARE_ADVICE,
  ELECTION_MORTGAGE_NUM,
  ELECTION_MORTGAGE_NUM_STR,
  urlRegExp,
  okRegExp,
  ELF_DECIMAL,
  schemeIds,
  FROM_WALLET,
  FROM_EXPIRED_VOTES,
  FROM_ACTIVE_VOTES,
  NODE_DEFAULT_NAME,
  RANK_NOT_EXISTED_SYMBOL,
  A_NUMBER_LARGE_ENOUGH_TO_GET_ALL,
  routePaths,
  voteTypeFormItemsMap
};
