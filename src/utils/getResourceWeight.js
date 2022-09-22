/**
 * @file getResouceWeight.js
 * @author zhouminghui
 * @description get resouceWeight
*/

import { Decimal } from 'decimal.js';

export default function getResourceWeight(tokenConverterContract, type) {
  return new Promise((resolve, reject) => {
    tokenConverterContract.GetPairConnector.call({ symbol: type }, (error, result) => {
      const resourceWeight = {
        resourceWeight: new Decimal(result.weight) || 0,
      };
      resolve(resourceWeight);
    });
  });
}
