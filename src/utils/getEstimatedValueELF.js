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
 * @param {object} tokenConverterContract
 * @param {string} tType
*/

import getResoruceConverter from './getResoruceConverter';

export default function getEstimatedValueELF(type, pidRes, tokenConverterContract, tokenContract, tType) {
    return new Promise((resolve, reject) => {
        getResoruceConverter(type, tokenConverterContract, tokenContract).then(result => {
            if (result) {
                if (tType === 'Buy') {
                    if (result.resourceBalance >= Math.abs(pidRes)) {
                        let resCont = Math.abs(pidRes) || 0;
                        const elfPayout = calculateCrossConnectorReturn(
                            result.resourceBalance, result.resoruceWeight,
                            result.elfBalance + result.virtualBalance, result.tokenWeight,
                            resCont
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
                        result.resourceBalance, result.resoruceWeight,
                        result.elfBalance + result.virtualBalance, result.tokenWeight,
                        resCont
                    );
                    resolve(elfPayout);
                }
            }
        });
    });
}
