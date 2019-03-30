/**
 * @file getPredictedValue
 * @author zhouminghui
 * 获取资源所等值的ELF数量
*/

import calculateCrossConnectorReturn from './calculateCrossConnectorReturn';

/**
 * Bancor  Numeric Acquisition of Formula Requirements
 *
 * @property getEstimatedValueELF
 *
 * @param {string} type
 * @param {number} pidRes
 * @param {object} resourceContract
 * @param {string} tType
*/

export default function getEstimatedValueELF(type, pidRes, resourceContract, tType) {
    return new Promise((resolve, reject) => {
        const initials = type.substring(0, 1);
        const word = type.substring(1, type.length);
        const paload = {
            type: initials + word.toLowerCase()
        };
        resourceContract.GetConverter.call(paload, (error, result) => {
            if (result) {
                if (tType === 'Buy') {
                    if (result.resBalance >= Math.abs(pidRes)) {
                        let resCont = Math.abs(pidRes) || 0;
                        const elfPayout = calculateCrossConnectorReturn(
                            result.resBalance, result.resWeight,
                            result.elfBalance, result.elfWeight,
                            -resCont
                        );
                        resolve(elfPayout);
                    }
                    else {
                        resolve('There are not so many resources.');
                    }
                }
                else {
                    let resCont = Math.abs(pidRes) || 0;
                    const elfPayout = calculateCrossConnectorReturn(
                        result.resBalance, result.resWeight,
                        result.elfBalance, result.elfWeight,
                        resCont
                    );
                    resolve(elfPayout);
                }
            }
        });
    });
}
