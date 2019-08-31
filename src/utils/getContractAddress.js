/**
 * @file getContractAddress.js
 * @author zhouminghui
 * 获取查询使用的公共钱包与合约地址
 */

import { aelf } from '../utils';
import * as AElf from 'aelf-sdk';
// todo: The exist of dividends is for compatibility, after all man use the more accurate name 'dividendContractAddr', we can drop the name of 'dividends'.
import {
  commonPrivateKey,
  multiToken,
  consensusDPoS,
  dividends,
  tokenConverter,
  dividendContractAddr,
  electionContractAddr,
  voteContractAddr,
  consensusContractAddr,
  multiTokenContractAddr
} from '@config/config';
export default function getContractAddress() {
  return new Promise((resolve, reject) => {
    const wallet = AElf.wallet.getWalletByPrivateKey(commonPrivateKey);
    aelf.chain.getChainStatus((error, result) => {
      const output = {
        consensusDPoS,
        dividends,
        multiToken,
        tokenConverter,
        wallet,
        chainInfo: result,
        dividendContractAddr,
        voteContractAddr,
        electionContractAddr,
        consensusContractAddr,
        multiTokenContractAddr
      };
      resolve(output);
    });
  });
}
