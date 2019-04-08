/**
 * @file getResouceWeight.js
 * @author zhouminghui
 * @description get resouceWeight
*/

import BigNumber from 'bignumber.js';

export default function getResoruceWeight(tokenConverterContract, type) {
    return new Promise((resolve, reject) => {
        tokenConverterContract.GetConnector.call({symbol: type}, (error, result) => {
            const resoruceWeight = {
                resoruceWeight: new BigNumber(result.weight) || 0
            };
            resolve(resoruceWeight);
        });
    });
}
