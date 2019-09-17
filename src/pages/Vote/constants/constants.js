/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 19:43:55
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-17 22:04:12
 * @Description: The constants used in Vote pages
 */

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
  }
];

const electionNotifiStatisData = {
  termEndTime: {
    title: '距本届（第X届）投票结束还有',
    num: '7天 00:00:00'
  },
  currentNodesAmount: {
    title: '当前节点数',
    num: 117
  },
  currentVotesAmount: {
    title: '当前总票数',
    num: 123456789
  },
  currentMiningReward: {
    // todo: maybe wrong
    title: '分红池(ELF)',
    num: 12345
  }
};

const myVoteStatisData = [
  {
    title: '投票总数(ELF)',
    num: 123000
  },
  {
    title: '投票收益(ELF)',
    num: 123456
  },
  {
    title: '可赎回票数(ELF)',
    num: 12345
  }
];

export { contractsNeedToLoad, electionNotifiStatisData, myVoteStatisData };
