/**
 * @file getResourceBalance.js
 * @author zhouminghui
 * @description get resource balance
*/

import config from '../../config/config';

export default function getResourceBalance(tokenContract, type) {
    return new Promise((resolve, reject) => {
        tokenContract.GetBalance.call({symbol: type, owner: config.tokenConverter}, (error, result) => {
            if (result) {
                const resourceBalance = {
                    resourceBalance: parseInt(result.balance, 10) || 0
                };
                resolve(resourceBalance);
            }
        });
    });
}