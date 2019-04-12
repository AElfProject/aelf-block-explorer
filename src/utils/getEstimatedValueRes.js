/**
 * @file getPredictedValue
 * @author zhouminghui
 * 获取ELF所能购买的资源数量
 * TODO:未计算手续费
*/

import calculateCrossConnectorElfReturn from './calculateCrossConnectorElfReturn';
import getResoruceConverter from './getResoruceConverter';



/**
 * Bancor  Numeric Acquisition of Formula Requirements
 *
 * @param {string} type  ELF, RAM, NET, CPU, STO
 * @param {number} paidElf
 * @param {Object} tokenConverterContract
 * @param {Object} tokenContract
 *
*/
export default function getEstimatedValueRes(type, paidElf, tokenConverterContract, tokenContract) {
    return new Promise((resolve, reject) => {
        getResoruceConverter(type, tokenConverterContract, tokenContract).then(result => {
            if (result) {
                let resCont = paidElf || 0;
                const elfPayout = calculateCrossConnectorElfReturn(
                    result.resourceBalance, result.resoruceWeight,
                    result.elfBalance.plus(result.virtualBalance), result.tokenWeight,
                    resCont
                );
                resolve(elfPayout);
            }
        });
    });
}

