/**
 * @file getPredictedValue
 * @author zhouminghui
 * 获取ELF所能购买的资源数量
 * TODO:未计算手续费
*/

import calculateCrossConnectorReturn from './calculateCrossConnectorReturn';

/**
 * Bancor  Numeric Acquisition of Formula Requirements
 *
 * @property getEstimatedValueRes
 *
 * @param {string} type
 * @param {number} paidElf
 * @param {object} resourceContract
 *
*/

export default function getEstimatedValueRes(type, paidElf, resourceContract) {
    const initials = type.substring(0, 1);
    const word = type.substring(1, type.length);
    const paload = {
        type: initials + word.toLowerCase()
    };
    return new Promise((resolve, reject) => {
        resourceContract.GetConverter.call(paload, (error, result) => {
            if (result) {
                let elfCont = paidElf || 0;
                const elfPayout = calculateCrossConnectorReturn(
                    result.elfBalance, result.elfWeight,
                    result.resBalance, result.resBalance,
                    elfCont
                );
                resolve(elfPayout);
            }
        });
    });
}

