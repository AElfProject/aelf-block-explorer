/**
 * @file getPredictedValue
 * @author zhouminghui
 * 获取ELF所能购买的资源数量
 * TODO:未计算手续费
 *
 * @author yangpeiyang
 * In fact: sell resource
 */

import GetReturnFromPaid from './GetReturnFromPaid';
import getResourceConverter from './getResourceConverter';

/**
 * Bancor  Numeric Acquisition of Formula Requirements
 *
 * @param {string} type  ELF, RAM, NET, CPU, STO
 * @param {number} paidElf
 * @param {Object} tokenConverterContract
 * @param {Object} tokenContract
 *
 */
export default function getEstimatedValueRes(
  type,
  sellResource,
  tokenConverterContract,
  tokenContract,
  switchMode,
) {
  return getResourceConverter(type, tokenConverterContract, tokenContract).then(
    (result) => {
      if (result) {
        let elfPayout = null;
        if (switchMode) {
          elfPayout = GetReturnFromPaid(
            result.elfBalance,
            result.tokenWeight,
            result.resourceBalance,
            result.resourceWeight,
            sellResource,
          );
        } else {
          elfPayout = GetReturnFromPaid(
            result.resourceBalance,
            result.resourceWeight,
            result.elfBalance,
            result.tokenWeight,
            sellResource,
          );
        }
        return elfPayout;
      }
    },
  );
}
