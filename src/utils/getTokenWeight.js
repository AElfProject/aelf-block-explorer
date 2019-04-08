/**
 * @file getTokenWeight.js
 * @author zhouminghui
 * @description get Token Weight
*/

import BigNumber from 'bignumber.js';

export default function getTokenWeight(tokenConverterContract) {
    return new Promise((resolve, reject) => {
        tokenConverterContract.GetConnector.call({symbol: 'ELF'}, (error, result) => {
            const tokenWeight = {
                tokenWeight: new BigNumber(result.weight) || 0,
                virtualBalance: new BigNumber(result.virtualBalance) || 0
            };
            resolve(tokenWeight);
        });
    });
}
