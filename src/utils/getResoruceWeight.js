/**
 * @file getResouceWeight.js
 * @author zhouminghui
 * @description get resouceWeight
*/

export default function getResoruceWeight(tokenConverterContract, type) {
    return new Promise((resolve, reject) => {
        tokenConverterContract.GetConnector.call({symbol: type}, (error, result) => {
            const resoruceWeight = {
                resoruceWeight: parseFloat(result.weight) || 0
            };
            resolve(resoruceWeight);
        });
    });
}
