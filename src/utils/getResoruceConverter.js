/**
 * @file getResoruceConverter.js
 * @author zhouminghui
 * @description 获取资源权重与数量信息
*/

import config from '../../config/config';

export default function getResoruceConverter(type, tokenConverterContract, tokenContract) {

    return new Promise((resolve, reject) => {

        const getResoruceWeight = new Promise((resolve, reject) => {
            tokenConverterContract.GetConnector.call({symbol: type}, (error, result) => {
                const resoruceWeight = {
                    resoruceWeight: parseFloat(result.weight) || 0
                };
                resolve(resoruceWeight);
            });
        });

        const getTokenWeight = new Promise((resolve, reject) => {
            tokenConverterContract.GetConnector.call({symbol: 'ELF'}, (error, result) => {
                const tokenWeight = {
                    tokenWeight: parseFloat(result.weight) || 0,
                    virtualBalance: parseInt(result.virtualBalance, 10) || 0
                };
                resolve(tokenWeight);
            });
        });

        const getResourceBalance = new Promise((resolve, reject) => {
            tokenContract.GetBalance.call({symbol: type, owner: config.tokenConverter}, (error, result) => {
                if (result) {
                    const resourceBalance = {
                        resourceBalance: parseInt(result.balance, 10) || 0
                    };
                    resolve(resourceBalance);
                }
            });
        });

        const getTokenBalance = new Promise((resolve, reject) => {
            tokenContract.GetBalance.call({symbol: 'ELF', owner: config.tokenConverter}, (error, result) => {
                if (result) {
                    const elfBalance = {
                        elfBalance: parseInt(result.balance, 10) || 0
                    };
                    resolve(elfBalance);
                }
            });
        });
        Promise.all([
            getResoruceWeight,
            getTokenWeight,
            getResourceBalance,
            getTokenBalance
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
