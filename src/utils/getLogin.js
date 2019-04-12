/**
 * @file getLogin.js
 * @author zhouminghui
*/

import config from '../../config/config';

export default function getLogin(nightElf, payload, callback) {
    const {
        appName
    } = payload;
    nightElf.login({
        appName,
        payload: {
            method: 'LOGIN',
            contracts: [{
                chainId: 'AELF',
                contractAddress: config.multiToken,
                contractName: 'Token',
                description: 'contract Token',
                github: ''
            }, {
                chainId: 'AELF',
                contractAddress: config.dividends,
                contractName: 'Dividend',
                description: 'contract Dividend',
                github: ''
            }, {
                chainId: 'AELF',
                contractAddress: config.consensusDPoS,
                contractName: 'Consensus.Dpos',
                description: 'contract Consensus',
                github: ''
            }, {
                chainId: 'AELF',
                contractAddress: config.tokenConverter,
                contractName: 'Token Converter',
                description: 'contract Token Converter',
                github: ''
            }]
        }
    }, (error, result) => {
        if (result) {
            callback(result);
        }
    });
}
