/**
 * @file contractChange.js
 * @author zhouminghui
*/

import {message} from 'antd';
import config from '../../config/config';

export default function contractChange(nightElf, values, currentWallet, appName) {
    return new Promise((resolve, reject) => {
        let contract = JSON.stringify(values.permissions[0].contracts);
        let token = false;
        let consensus = false;
        let dividend = false;
        let resource = false;
        if (contract.indexOf(config.multiToken) === -1) {
            token = true;
        }

        if (contract.indexOf(config.consensusDPoS)  === -1) {
            consensus = true;
        }

        if (contract.indexOf(config.dividends)  === -1) {
            dividend = true;
        }

        if (contract.indexOf(config.tokenConverter)  === -1) {
            resource = true;
        }

        if (token || consensus || dividend || resource) {
            nightElf.setContractPermission({
                appName,
                chainId: 'AELF',
                payload: {
                    // appName: message.appName,
                    // domain: message.hostname
                    address: currentWallet.address,
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
                if (result && result.error === 0) {
                    resolve(true);
                }
                else {
                    message.error(result.errorMessage.message, 5);
                }
            });
        }
        if (!token && !consensus && !dividend && !resource) {
            resolve(false);
        }
    });
}
