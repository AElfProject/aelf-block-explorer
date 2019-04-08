/**
 * @file getResourceBalance.js
 * @author zhouminghui
 * @description get resource balance
*/

import config from '../../config/config';
import BigNumber from 'bignumber.js';

export default function getResourceBalance(tokenContract, type) {
    return new Promise((resolve, reject) => {
        tokenContract.GetBalance.call({symbol: type, owner: config.tokenConverter}, (error, result) => {
            if (result) {
                const resourceBalance = {
                    resourceBalance: new BigNumber(result.balance) || 0
                };
                resolve(resourceBalance);
            }
        });
    });
}