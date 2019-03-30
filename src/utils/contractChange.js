/**
 * @file contractChange.js
 * @author zhouminghui
*/

import {message} from 'antd';
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
                        contracts: [{
                            chainId: 'AELF',
                            contractAddress: contracts.TOKENADDRESS,
                            contractName: 'Token',
                            description: 'contract Token'
                        }, {
                            chainId: 'AELF',
                            contractAddress: contracts.DIVIDENDSADDRESS,
                            contractName: 'Dividends',
                            description: 'contract Dividends'
                        }, {
                            chainId: 'AELF',
                            contractAddress: contracts.CONSENSUSADDRESS,
                            contractName: 'Consensus.Dpos',
                            description: 'contract Consensus'
                        },
                        {
                            chainId: 'AELF',
                            contractAddress: contracts.RESOURCEADDRESS,
                            contractName: 'Resource',
                            description: 'contract Resource'
                        }]
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
