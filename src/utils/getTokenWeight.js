/**
 * @file getTokenWeight.js
 * @author zhouminghui
 * @description get Token Weight
*/


export default function getTokenWeight(tokenConverterContract) {
    return new Promise((resolve, reject) => {
        tokenConverterContract.GetConnector.call({symbol: 'ELF'}, (error, result) => {
            const tokenWeight = {
                tokenWeight: parseFloat(result.weight) || 0,
                virtualBalance: parseInt(result.virtualBalance, 10) || 0
            };
            resolve(tokenWeight);
        });
    });
}
