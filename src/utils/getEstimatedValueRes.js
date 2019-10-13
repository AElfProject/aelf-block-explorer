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
import getResoruceConverter from './getResoruceConverter';
import { ELF_PRECISION } from '@src/constants';

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
  switchMode
) {
  return new Promise((resolve, reject) => {
    getResoruceConverter(type, tokenConverterContract, tokenContract).then(
      result => {
        if (result) {
          // todo: divide price
          // todo: maybe has problem, use 0.0005 to avoid the elf's balance is insufficient, instead with rpc later
          // paidElf -= 3;
          // paidElf = paidElf / (1 + 0.005 + 0.0005) || 0;
          let elfPayout = null;
          console.log({
            switchMode
          });
          if (switchMode) {
            elfPayout = GetReturnFromPaid(
              result.elfBalance.plus(result.virtualBalance),
              result.tokenWeight,
              result.resourceBalance,
              result.resoruceWeight,
              sellResource
            );
          } else {
            elfPayout = GetReturnFromPaid(
              result.resourceBalance,
              result.resoruceWeight,
              result.elfBalance.plus(result.virtualBalance),
              result.tokenWeight,
              sellResource
            );
          }
          console.log('getResoruceConverter', {
            result,
            elfPayout,
            sellResource
          });
          resolve(elfPayout);
        }
      }
    );
  });
}
