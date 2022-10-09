/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-27 17:07:56
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-30 14:38:00
 * @Description: the api of consensus contract
 */
// todo: Can be removed later
export const fetchCurrentMinerList = (contract) => contract.GetCurrentMinerList.call();

export const fetchCurrentMinerPubkeyList = (contract) => contract.GetCurrentMinerPubkeyList.call();
