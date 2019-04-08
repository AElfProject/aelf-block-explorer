/**
 * @file getTokenWeight.js
 * @author zhouminghui
 * @description get Token Weight
*/

import {Decimal} from 'decimal.js';

export default function getTokenWeight(tokenConverterContract) {
    return new Promise((resolve, reject) => {
        tokenConverterContract.GetConnector.call({symbol: 'ELF'}, (error, result) => {
            const tokenWeight = {
                tokenWeight: new Decimal(result.weight) || 0,
                virtualBalance: new Decimal(result.virtualBalance) || 0
            };
            resolve(tokenWeight);
        });
    });
}
