/**
 * @file getResoruceConverter.js
 * @author zhouminghui
 * @description 获取资源权重与数量信息
*/

import getResourceWeight from './getResourceWeight';
import getTokenWeight from './getTokenWeight';
import getResourceBalance from './getResourceBalance';
import getTokenBalance from './getTokenBalance';

export default function getResourceConverter(type, tokenConverterContract, tokenContract) {
    return Promise.all([
        getResourceWeight(tokenConverterContract, type),
        getTokenWeight(tokenConverterContract),
        getResourceBalance(tokenContract, type),
        getTokenBalance(tokenConverterContract, type)
    ]).then(result => {
        return result.reduce((acc, v) => ({...v, ...acc}), {})
    });
}
