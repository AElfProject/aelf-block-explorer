/**
 * @file getResouceWeight.js
 * @author zhouminghui
 * @description get resouceWeight
*/

import {Decimal} from 'decimal.js';

export default function getResoruceWeight(tokenConverterContract, type) {
    return new Promise((resolve, reject) => {
        tokenConverterContract.GetConnector.call({symbol: type}, (error, result) => {
            const resoruceWeight = {
                resoruceWeight: new Decimal(result.weight) || 0
            };
            resolve(resoruceWeight);
        });
    });
}
