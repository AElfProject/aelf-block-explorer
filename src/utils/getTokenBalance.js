/**
 * @file getTokenBalance.js
 * @author zhouminghui
 * @description get token balance
*/

import config from '../../config/config';

export default function getTokenBalance(tokenContract) {
    return new Promise((resolve, reject) => {
        tokenContract.GetBalance.call({symbol: 'ELF', owner: config.tokenConverter}, (error, result) => {
            if (result) {
                const elfBalance = {
                    elfBalance: parseInt(result.balance, 10) || 0
                };
                resolve(elfBalance);
            }
        });
    });
}