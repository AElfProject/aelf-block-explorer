/**
 * @file contractChange.js
 * @author zhouminghui
*/

import {message} from 'antd';
import {resourceAddress} from '../../config/config';
export default function contractChange(values, contracts, currentWallet, appName) {
    return new Promise((resolve, reject) => {
        let contract = JSON.stringify(values.permissions[0].contracts);
        let token = false;
        let consensus = false;
        let dividend = false;
        let resource = false;
        if (contract.indexOf(contracts.TOKENADDRESS) === -1) {
            token = true;
        }

        if (contract.indexOf(contracts.CONSENSUSADDRESS)  === -1) {
            consensus = true;
        }

        if (contract.indexOf(contracts.DIVIDENDSADDRESS)  === -1) {
            dividend = true;
        }

        if (contract.indexOf(contracts.RESOURCEADDRESS)  === -1) {
            resource = true;
        }

        if (token || consensus || dividend || resource) {
            window.NightElf.api({
                appName,
                method: 'OPEN_PROMPT',
                chainId: 'AELF',
                payload: {
                    method: 'SET_CONTRACT_PERMISSION',
                    payload: {
                        address: currentWallet.address,
                        contracts: [
                            {
                                chainId: 'AELF',
                                contractAddress: contracts.TOKENADDRESS,
                                contractName: 'token',
                                description: 'contract token'
                            }, {
                                chainId: 'AELF',
                                contractAddress: contracts.DIVIDENDSADDRESS,
                                contractName: 'dividends',
                                description: 'contract dividends'
                            }, {
                                chainId: 'AELF',
                                contractAddress: contracts.CONSENSUSADDRESS,
                                contractName: 'consensus',
                                description: 'contract consensus'
                            },
                            {
                                chainId: 'AELF',
                                contractAddress: resourceAddress,
                                contractName: 'resource',
                                description: 'contract resource'
                            }
                        ]
                    }
                }
            }).then(result => {
                if (result.error === 0) {
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
