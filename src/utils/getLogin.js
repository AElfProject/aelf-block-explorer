/**
 * @file getLogin.js
 * @author zhouminghui
*/

import config from '../../config/config';

export default function getLogin(payload, callback) {
    const {
        appName
    } = payload;
    window.NightElf.api({
        appName,
        method: 'LOGIN',
        payload: {
            payload: {
                // appName: message.appName,
                // domain: message.hostname
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
        }
    }).then(result => {
        if (result) {
            callback(result);
        }
    });
}