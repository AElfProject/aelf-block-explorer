/**
 * @file getPredictedValue
 * @author zhouminghui
 * 获取资源所等值的ELF数量
 * TODO:未计算手续费
*/

import calculateCrossConnectorReturn from './calculateCrossConnectorReturn';
import hexCharCodeToStr from './hexCharCodeToStr';
export default function getEstimatedValueELF(type, pidRes, resourceContract) {
    return new Promise((resolve, reject) => {
        resourceContract.GetConverter(type, (error, result) => {
            const converter = JSON.parse(hexCharCodeToStr(result.return));
            let resCont = -pidRes || 0;
            const elfPayout = calculateCrossConnectorReturn(
                converter.ResBalance, converter.ResWeight,
                converter.ElfBalance, converter.ElfWeight,
                resCont
            );
            resolve(-elfPayout);
        });
    });
}
