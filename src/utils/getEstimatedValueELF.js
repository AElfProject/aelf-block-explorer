/**
 * @file getPredictedValue
 * @author zhouminghui
 * 获取资源所等值的ELF数量
 */

import GetAmountToPayFromReturn from './GetAmountToPayFromReturn';

/**
 * Bancor  Numeric Acquisition of Formula Requirements
 *
 * @property getEstimatedValueELF
 *
 * @param {string} type
 * @param {number} pidRes
 * @param {object} tokenConverterContract
 * @param {string} tType
 */

import getResoruceConverter from './getResoruceConverter';

export default function getEstimatedValueELF(
  type,
  pidRes,
  tokenConverterContract,
  tokenContract
) {
  return new Promise((resolve, reject) => {
    // todo: consider the frequency or time to get the data as it will spend many time
    getResoruceConverter(type, tokenConverterContract, tokenContract).then(
      result => {
        if (result) {
          console.log(result.resourceBalance.toNumber());
          if (result.resourceBalance.toNumber() >= Math.abs(pidRes)) {
            const resCont = Math.abs(pidRes) || 0;
            const elfPayout = GetAmountToPayFromReturn(
              result.elfBalance.plus(result.virtualBalance),
              result.tokenWeight,
              result.resourceBalance,
              result.resoruceWeight,
              resCont
            );
            console.log({
              elfPayout,
              pidRes,
              resCont
            });
            resolve(elfPayout);
          } else {
            resolve('There are not so many resources.');
          }
        }
      }
    );
  });
}
