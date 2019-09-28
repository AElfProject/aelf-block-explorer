/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-27 17:07:56
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-27 17:38:20
 * @Description: the api of consensus contract
 */

export const fetchCurrentMinerList = (contract) => {
  return contract.GetCurrentMinerList.call();
};
