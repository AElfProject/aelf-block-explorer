/**
 * @file getContractAddress.js
 * @author zhouminghui
 * 获取查询使用的公共钱包与合约地址
 */

import AElf from 'aelf-sdk';
// todo: The exist of dividends is for compatibility, after all man use the more accurate name 'dividendContractAddr', we can drop the name of 'dividends'.
import {
  commonPrivateKey,
  multiToken,
  consensusDPoS,
  dividends,
  tokenConverter,
  electionContractAddr,
  voteContractAddr,
  profitContractAddr,
} from '@config/config';
import { aelf } from '../utils';

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
        voteContractAddr,
        electionContractAddr,

        profitContractAddr,
      };
      resolve(output);
    });
  });
}
