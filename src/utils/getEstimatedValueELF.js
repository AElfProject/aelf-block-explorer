/**
 * @file getPredictedValue
 * @author zhouminghui
 * 获取资源所等值的ELF数量
 * TODO:未计算手续费
*/

import getResource from './getResource';
import getWallet from './getWallet';
import calculateCrossConnectorReturn from './calculateCrossConnectorReturn';
import hexCharCodeToStr from './hexCharCodeToStr';

export default function getEstimatedValueELF(type, privateKey, pidRes) {
    const wallet = getWallet(privateKey);
    const resource = getResource(wallet);
    const converter = JSON.parse(hexCharCodeToStr(resource.GetConverter(type).return));
    const elfPayout = calculateCrossConnectorReturn(
        converter.ResBalance, converter.ResWeight,
        converter.ElfBalance, converter.ElfWeight,
        pidRes
    );
    return elfPayout;
}
