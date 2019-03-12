/**
 * @file getPredictedValue
 * @author zhouminghui
 * 获取ELF所能购买的资源数量
 * TODO:未计算手续费
*/

import calculateCrossConnectorReturn from './calculateCrossConnectorReturn';
import hexCharCodeToStr from './hexCharCodeToStr';


export default function getEstimatedValueRes(type, paidElf, resourceContract) {
    return new Promise((resolve, reject) => {
        resourceContract.GetConverter(type, (error, result) => {
            console.log(result);
            const converter = JSON.parse(hexCharCodeToStr(result));
            let elfCont = paidElf || 0;
            const elfPayout = calculateCrossConnectorReturn(
                converter.ElfBalance, converter.ElfWeight,
                converter.ResBalance, converter.ResWeight,
                elfCont
            );
            resolve(elfPayout);
        });
    });
}

