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
        domain: 'aelf.io',
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
                    description: 'contract Token'
                }, {
                    chainId: 'AELF',
                    contractAddress: config.dividends,
                    contractName: 'Dividend',
                    description: 'contract Dividend'
                }, {
                    chainId: 'AELF',
                    contractAddress: config.consensusDPoS,
                    contractName: 'Consensus.Dpos',
                    description: 'contract Consensus'
                },
                {
                    chainId: 'AELF',
                    contractAddress: config.resource,
                    contractName: 'Resource',
                    description: 'contract Resource'
                }]
            }
        }
    }).then(result => {
        if (result) {
            callback(result);
        }
    });
}