/**
 * @file getTokenBalance.js
 * @author zhouminghui
 * @description get token balance
*/

import config from '../../config/config';
import BigNumber from 'bignumber.js';

export default function getTokenBalance(tokenContract) {
    return new Promise((resolve, reject) => {
        tokenContract.GetBalance.call({symbol: 'ELF', owner: config.tokenConverter}, (error, result) => {
            if (result) {
                const elfBalance = {
                    elfBalance: new BigNumber(result.balance) || 0
                };
                resolve(elfBalance);
            }
        });
    });
}