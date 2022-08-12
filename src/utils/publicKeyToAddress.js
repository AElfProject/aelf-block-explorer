/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-10-19 16:41:14
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-19 17:09:00
 * @Description: file content
 */
import AElf from 'aelf-sdk';

const publicKeyToAddress = (publicKey) => {
  const { getAddressFromPubKey, ellipticEc } = AElf.wallet;

  const pubkeyByteArray = ellipticEc.keyFromPublic(publicKey, 'hex');
  const address = getAddressFromPubKey(pubkeyByteArray.pub);
  return address;
};

export default publicKeyToAddress;
