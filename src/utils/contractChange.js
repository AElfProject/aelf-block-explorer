/**
 * @file contractChange.js
 * @author zhouminghui
*/

import {message} from 'antd';
import { CHAIN_ID } from '@src/constants';
import config from '../../config/config';

export default function contractChange(nightElf, values, currentWallet, appName) {
    return new Promise((resolve, reject) => {
        let contract = JSON.stringify(values.permissions[0].contracts);
        let token = false;
        let consensus = false;
        let dividend = false;
        let resource = false;
        console.log('contractChange<<<<<')
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
                chainId: CHAIN_ID,
                payload: {
                    // appName: message.appName,
                    // domain: message.hostname
                    address: currentWallet.address,
                    contracts: [{
                        chainId: CHAIN_ID,
                        contractAddress: config.multiToken,
                        contractName: 'Token',
                        description: 'contract Token',
                        github: ''
                    }, {
                        chainId: CHAIN_ID,
                        contractAddress: config.dividends,
                        contractName: 'Dividend',
                        description: 'contract Dividend',
                        github: ''
                    }, {
                        chainId: CHAIN_ID,
                        contractAddress: config.consensusDPoS,
                        contractName: 'Consensus.Dpos',
                        description: 'contract Consensus',
                        github: ''
                    }, {
                        chainId: CHAIN_ID,
                        contractAddress: config.tokenConverter,
                        contractName: 'Token Converter',
                        description: 'contract Token Converter',
                        github: ''
                    }, {
                        chainId: CHAIN_ID,
                        contractAddress: config.electionContractAddr,
                        contractName: 'Election',
                        description: 'contract Election',
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
