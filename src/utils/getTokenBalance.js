/**
 * @file getTokenBalance.js
 * @author zhouminghui
 * @description get token balance
*/

import config from '../../config/config';
import {Decimal} from 'decimal.js';

export default function getTokenBalance(tokenContract) {
    // stupid code, do not hire people like this anymore
    // todo: change contract to get the right balance
    return new Promise((resolve, reject) => {
        tokenContract.GetBalance.call({symbol: config.SYMBOL, owner: config.tokenConverter}, (error, result) => {
            if (result) {
                const elfBalance = {
                    elfBalance: new Decimal(result.balance) || 0
                };
                resolve(elfBalance);
            }
        });
    });
}
