/**
 * @file getPredictedValue
 * @author zhouminghui
 * 获取ELF所能购买的资源数量
 * TODO:未计算手续费
*/

import getResource from './getResource';
import getWallet from './getWallet';
import calculateCrossConnectorReturn from './calculateCrossConnectorReturn';
import hexCharCodeToStr from './hexCharCodeToStr';

export default function getEstimatedValueRes(type, privateKey, paidElf) {
    const wallet = getWallet(privateKey);
    const resource = getResource(wallet);
    const converter = JSON.parse(hexCharCodeToStr(resource.GetConverter(type).return));
    const resourcePayout = calculateCrossConnectorReturn(
        converter.ElfBalance, converter.ElfWeight,
        converter.ResBalance, converter.ResWeight,
        paidElf
    );
    console.log(resourcePayout);
    return resourcePayout;
}
