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

import getResourceConverter from './getResourceConverter';

export default function getEstimatedValueELF(
  type,
  pidRes,
  tokenConverterContract,
  tokenContract,
) {
  return new Promise((resolve, reject) => {
    getResourceConverter(type, tokenConverterContract, tokenContract).then(
      (result) => {
        if (result) {
          if (result.resourceBalance.dividedBy(1e8).toNumber() >= Math.abs(pidRes)) {
            const resCont = Math.abs(pidRes) || 0;
            const elfPayout = GetAmountToPayFromReturn(
              result.elfBalance,
              result.tokenWeight,
              result.resourceBalance,
              result.resourceWeight,
              resCont,
            );
            resolve(elfPayout);
          } else {
            reject('There are not so many resources.');
          }
        }
      },
    );
  });
}
