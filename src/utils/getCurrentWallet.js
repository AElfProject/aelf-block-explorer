/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-19 00:33:55
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-23 16:21:50
 * @Description: file content
 */
const getCurrentWallet = () => {
  let currentWallet = JSON.parse(localStorage.getItem('currentWallet'));
  if (currentWallet !== null && currentWallet.publicKey) {
    currentWallet.pubKey =
      '04' + currentWallet.publicKey.x + currentWallet.publicKey.y;
  } else {
    currentWallet = {
      address: null,
      name: null,
      pubKey: {
        x: null,
        y: null
      }
    };
  }
  return currentWallet;
};

export default getCurrentWallet;
