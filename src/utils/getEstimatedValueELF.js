/**
 * @file getPredictedValue
 * @author zhouminghui
 * 获取资源所等值的ELF数量
 * TODO:未计算手续费
*/

import calculateCrossConnectorReturn from './calculateCrossConnectorReturn';
import hexCharCodeToStr from './hexCharCodeToStr';
export default function getEstimatedValueELF(type, pidRes, resourceContract, tType) {
    return new Promise((resolve, reject) => {
        resourceContract.GetConverter(type, (error, result) => {
            const converter = JSON.parse(hexCharCodeToStr(result.return));
            if (tType === 'Buy') {
                if (converter.ResBalance >= Math.abs(pidRes)) {
                    let resCont = Math.abs(pidRes) || 0;
                    const elfPayout = calculateCrossConnectorReturn(
                        converter.ResBalance, converter.ResWeight,
                        converter.ElfBalance, converter.ElfWeight,
                        resCont
                    );
                    console.log(isNaN('123'));
                    resolve(elfPayout);
                }
                else {
                    resolve('There are not so many resources.');
                }
            }
            else {
                let resCont = Math.abs(pidRes) || 0;
                const elfPayout = calculateCrossConnectorReturn(
                    converter.ResBalance, converter.ResWeight,
                    converter.ElfBalance, converter.ElfWeight,
                    resCont
                );
                console.log(isNaN('123'));
                resolve(elfPayout);
            }
        });
    });
}
