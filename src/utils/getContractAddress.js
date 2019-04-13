/**
 * @file getContractAddress.js
 * @author zhouminghui
 * 获取查询使用的公共钱包与合约地址
*/

import {aelf} from '../utils';
import * as AElf from 'aelf-sdk';
import {commonPrivateKey, multiToken, consensusDPoS, dividends, tokenConverter} from '../../config/config';
// export default function getContractAddress() {
//     return new Promise((resolve, reject) => {
//         aelf.chain.connectChain((error, result) => {
//             console.log(result);
//             const CONSENSUSADDRESS = result['AElf.Contracts.Consensus.DPoS'];
//             const DIVIDENDSADDRESS = result['AElf.Contracts.Dividend'];
//             const TOKENADDRESS = result['AElf.Contracts.MultiToken'];
//             const RESOURCEADDRESS = result['AElf.Contracts.Resource'];
//             const wallet = AElf.wallet.getWalletByPrivateKey(commonPrivateKey);
//             const output = {
//                 CONSENSUSADDRESS,
//                 DIVIDENDSADDRESS,
//                 TOKENADDRESS,
//                 RESOURCEADDRESS,
//                 wallet
//             };
//             resolve(output);
//         });
//     });
// }

export default function getContractAddress() {
    return new Promise((resolve, reject) => {
        const wallet = AElf.wallet.getWalletByPrivateKey(commonPrivateKey);
        aelf.chain.getChainInformation((error, result) => {
            const output = {
                consensusDPoS,
                dividends,
                multiToken,
                tokenConverter,
                wallet,
                chainInfo: result
            };
            resolve(output);
        });
    });
}
