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

export default function getEstimatedValueELF(type, pidRes, tokenConverterContract, tokenContract) {
    return new Promise((resolve, reject) => {
        getResoruceConverter(type, tokenConverterContract, tokenContract).then(result => {
            if (result) {
                console.log(result.resourceBalance.toNumber());
                if (result.resourceBalance.toNumber() >= Math.abs(pidRes)) {
                    let resCont = Math.abs(pidRes) || 0;
                    const elfPayout = calculateCrossConnectorReturn(
                        result.resourceBalance, result.resoruceWeight,
                        result.elfBalance.plus(result.virtualBalance), result.tokenWeight,
                        resCont
                    );
                console.log('elfPayout', elfPayout)
                resolve(elfPayout);
                }
                else {
                    resolve('There are not so many resources.');
                }
            }
        });
    });
}
