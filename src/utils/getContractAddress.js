/**
 * @file getContractAddress.js
 * @author zhouminghui
 * 获取查询使用的公共钱包与合约地址
*/

import {aelf} from '../utils';
import * as Aelf from 'aelf-sdk';
import {commonPrivateKey} from '../../config/config';
export default function getContractAddress() {
    return new Promise((resolve, reject) => {
        aelf.chain.connectChain((error, result) => {
            const CONSENSUSADDRESS = result['AElf.Contracts.Consensus.DPoS'];
            const DIVIDENDSADDRESS = result['AElf.Contracts.Dividends'];
            const TOKENADDRESS = result['AElf.Contracts.Token'];
            const RESOURCEADDRESS = result['AElf.Contracts.Resource'];
            const wallet = Aelf.wallet.getWalletByPrivateKey(commonPrivateKey);
            const output = {
                CONSENSUSADDRESS,
                DIVIDENDSADDRESS,
                TOKENADDRESS,
                RESOURCEADDRESS,
                wallet
            };
            resolve(output);
        });
    });
}
