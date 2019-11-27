/**
 * @file getResourceBalance.js
 * @author zhouminghui
 * @description get resource balance
*/

import config from '../../config/config';
import {Decimal} from 'decimal.js';

export default function getResourceBalance(tokenContract, type) {
    return new Promise((resolve, reject) => {
        tokenContract.GetBalance.call({symbol: type, owner: config.tokenConverter}, (error, result) => {
            if (result) {
                const resourceBalance = {
                    resourceBalance: new Decimal(result.balance) || 0
                };
                resolve(resourceBalance);
            }
        });
    });
}
