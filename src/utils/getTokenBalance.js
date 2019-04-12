/**
 * @file getTokenBalance.js
 * @author zhouminghui
 * @description get token balance
*/

import config from '../../config/config';
import {Decimal} from 'decimal.js';

export default function getTokenBalance(tokenContract) {
    return new Promise((resolve, reject) => {
        tokenContract.GetBalance.call({symbol: 'ELF', owner: config.tokenConverter}, (error, result) => {
            if (result) {
                const elfBalance = {
                    elfBalance: new Decimal(result.balance) || 0
                };
                resolve(elfBalance);
            }
        });
    });
}