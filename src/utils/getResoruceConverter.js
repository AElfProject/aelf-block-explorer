/**
 * @file getResoruceConverter.js
 * @author zhouminghui
 * @description 获取资源权重与数量信息
*/

import config from '../../config/config';
import getResoruceWeight from './getResoruceWeight';
import getTokenWeight from './getTokenWeight';
import getResourceBalance from './getResourceBalance';
import getTokenBalance from './getTokenBalance';

export default function getResoruceConverter(type, tokenConverterContract, tokenContract) {
    return new Promise((resolve, reject) => {
        Promise.all([
            getResoruceWeight(tokenConverterContract, type),
            getTokenWeight(tokenConverterContract),
            getResourceBalance(tokenContract, type),
            getTokenBalance(tokenContract)
        ]).then(result => {
            let obj = {};
            for (let i = 0, len = result.length; i < len; i++) {
                for (let item in result[i]) {
                    obj[item] = result[i][item];
                }
            }
            resolve(obj);
        });
    });
}
