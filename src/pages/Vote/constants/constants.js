/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 19:43:55
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-31 20:42:08
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

export {
  contractsNeedToLoad
};
