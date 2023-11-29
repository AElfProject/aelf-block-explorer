/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 19:43:55
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-07 21:16:44
 * @Description: The constants used in Vote pages
 */
import { thousandsComma } from "@utils/formater";
// todo: handle the code as follow
import { ELF_DECIMAL, MY_VOTE_DATA_TIP } from "@src/constants";

//  The contracts need to load in page ElectionNotification
const contractsNeedToLoad = [
  {
    contractAddrValName: "consensusDPoS",
    contractNickname: "consensusContract",
  },
  {
    contractAddrValName: "dividends",
    contractNickname: "dividendContract",
  },
  {
    contractAddrValName: "multiToken",
    contractNickname: "multiTokenContract",
  },
  {
    contractAddrValName: "voteContractAddr",
    contractNickname: "voteContract",
  },
  {
    contractAddrValName: "electionContractAddr",
    contractNickname: "electionContract",
  },
  {
    contractAddrValName: "profitContractAddr",
    contractNickname: "profitContract",
  },
];

const contractsNeedToLoadFromExt = [
  {
    contractAddrValName: "electionContractAddr",
    contractNickname: "electionContractFromExt",
  },
  {
    contractAddrValName: "profitContractAddr",
    contractNickname: "profitContractFromExt",
  },
];

const myVoteStatistData = {
  myTotalVotesAmount: {
    title: "Total Votes",
    tooltip: MY_VOTE_DATA_TIP,
  },
  // myVoteProfit: {
  //   title: `投票收益(${LOWER_SYMBOL})`
  // },
  withdrawableVotesAmount: {
    title: "Redeemable Votes",
  },
};
const MINIMUN_HARDWARE_ADVICE =
  "c5.xlarge instance with 4 vCPU, 8GiB RAM, 1TB hard drive, 5 Mbps bandwidth";
const HARDWARE_ADVICE =
  "c5.2xlarge instance with 8 vCPU, 16GiB RAM, 1TB hard drive, 100 Mbps bandwidth";
const MINIMUN_HARDWARE_ADVICE_TEST =
  "c5.large instance with 2 vCPU, 4GiB RAM, 800GiB hard drive, 5 Mbps bandwidth";
const HARDWARE_ADVICE_TEST =
  "c5.xlarge instance with 4 vCPU, 8GiB RAM, 800GiB hard drive, 100 Mbps bandwidth";

const ELECTION_MORTGAGE_NUM = 100000;
const ELECTION_MORTGAGE_NUM_STR = thousandsComma(ELECTION_MORTGAGE_NUM);
const A_NUMBER_LARGE_ENOUGH_TO_GET_ALL = 100000;

const urlRegExp = new RegExp(
  "^(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$",
  "i"
);

const okRegExp = /^2\d{2}$/;

const FROM_WALLET = "fromWallet";
const FROM_EXPIRED_VOTES = "fromExpiredVotes";
const FROM_ACTIVE_VOTES = "fromActiveVotes";
const NODE_DEFAULT_NAME = "Default";

const voteTypeFormItemsMap = {
  [FROM_WALLET]: ["voteAmount", "lockTime"],
  [FROM_EXPIRED_VOTES]: ["voteFromExpiredVoteAmount", "lockTime"],
  [FROM_ACTIVE_VOTES]: ["nodeName", "nodeAddress", "switchVoteAmount"],
};

// When the team I voted is not candidate in current term, use the symbol to display.
const RANK_NOT_EXISTED_SYMBOL = "-";

const routePaths = {
  vote: "/vote",
  electionNotifi: "/vote/election",
  applyToBeANode: "/vote/apply",
  teamInfoKeyin: "/vote/apply/keyin",
  teamDetail: "/vote/team",
  myVote: "/vote/myvote",
};

export {
  contractsNeedToLoad,
  contractsNeedToLoadFromExt,
  myVoteStatistData,
  MINIMUN_HARDWARE_ADVICE,
  HARDWARE_ADVICE,
  MINIMUN_HARDWARE_ADVICE_TEST,
  HARDWARE_ADVICE_TEST,
  ELECTION_MORTGAGE_NUM,
  ELECTION_MORTGAGE_NUM_STR,
  urlRegExp,
  okRegExp,
  ELF_DECIMAL,
  FROM_WALLET,
  FROM_EXPIRED_VOTES,
  FROM_ACTIVE_VOTES,
  NODE_DEFAULT_NAME,
  RANK_NOT_EXISTED_SYMBOL,
  A_NUMBER_LARGE_ENOUGH_TO_GET_ALL,
  routePaths,
  voteTypeFormItemsMap,
};
