/**
 * @file testingContract.js
 * @author zhouminghui
*/

import {message} from 'antd';
export default function testingContract(values, contracts, currentWallet) {
    return new Promise((resolve, reject) => {
        let contract = JSON.stringify(values.permissions[0].contracts);
        let token = false;
        let consensus = false;
        let dividend = false;
        if (contract.indexOf(contracts.TOKENADDRESS) === -1) {
            token = true;
        }

        if (contract.indexOf(contracts.CONSENSUSADDRESS)  === -1) {
            consensus = true;
        }

        if (contract.indexOf(contracts.DIVIDENDSADDRESS)  === -1) {
            dividend = true;
        }

        if (token && consensus && dividend) {
            window.NightElf.api({
                appName: 'hzzTest',
                method: 'OPEN_PROMPT',
                chainId: 'AELF',
                hostname: 'aelf.io',
                payload: {
                    method: 'SET_PERMISSION',
                    payload: {
                        address: currentWallet.address,
                        contracts: [
                            {
                                chainId: 'AELF',
                                contractAddress: contracts.TOKENADDRESS,
                                contractName: 'token',
                                description: 'token contract'
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


        if (token && consensus && !dividend) {
            window.NightElf.api({
                appName: 'hzzTest',
                method: 'OPEN_PROMPT',
                chainId: 'AELF',
                hostname: 'aelf.io',
                payload: {
                    method: 'SET_PERMISSION',
                    payload: {
                        address: currentWallet.address,
                        contracts: [
                            {
                                chainId: 'AELF',
                                contractAddress: contracts.TOKENADDRESS,
                                contractName: 'token',
                                description: 'token contract'
                            }, {
                                chainId: 'AELF',
                                contractAddress: contracts.CONSENSUSADDRESS,
                                contractName: 'consensus',
                                description: 'contract consensus'
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

        if (token && !consensus && dividend) {
            window.NightElf.api({
                appName: 'hzzTest',
                method: 'OPEN_PROMPT',
                chainId: 'AELF',
                hostname: 'aelf.io',
                payload: {
                    method: 'SET_PERMISSION',
                    payload: {
                        address: currentWallet.address,
                        contracts: [
                            {
                                chainId: 'AELF',
                                contractAddress: contracts.TOKENADDRESS,
                                contractName: 'token',
                                description: 'token contract'
                            }, {
                                chainId: 'AELF',
                                contractAddress: contracts.DIVIDENDSADDRESS,
                                contractName: 'dividends',
                                description: 'contract dividends'
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

        if (!token && consensus && dividend) {
            window.NightElf.api({
                appName: 'hzzTest',
                method: 'OPEN_PROMPT',
                chainId: 'AELF',
                hostname: 'aelf.io',
                payload: {
                    method: 'SET_PERMISSION',
                    payload: {
                        address: currentWallet.address,
                        contracts: [
                            {
                                chainId: 'AELF',
                                contractAddress: contracts.DIVIDENDSADDRESS,
                                contractName: 'dividends',
                                description: 'contract dividends'
                            }, {
                                chainId: 'AELF',
                                contractAddress: contracts.CONSENSUSADDRESS,
                                contractName: 'consensus',
                                description: 'contract consensus'
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

        if (!token && !consensus && dividend) {
            window.NightElf.api({
                appName: 'hzzTest',
                method: 'OPEN_PROMPT',
                chainId: 'AELF',
                hostname: 'aelf.io',
                payload: {
                    method: 'SET_PERMISSION',
                    payload: {
                        address: currentWallet.address,
                        contracts: [
                            {
                                chainId: 'AELF',
                                contractAddress: contracts.DIVIDENDSADDRESS,
                                contractName: 'dividends',
                                description: 'contract dividends'
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

        if (token && !consensus && !dividend) {
            window.NightElf.api({
                appName: 'hzzTest',
                method: 'OPEN_PROMPT',
                chainId: 'AELF',
                hostname: 'aelf.io',
                payload: {
                    method: 'SET_PERMISSION',
                    payload: {
                        address: currentWallet.address,
                        contracts: [
                            {
                                chainId: 'AELF',
                                contractAddress: contracts.TOKENADDRESS,
                                contractName: 'token',
                                description: 'token contract'
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

        if (!token && consensus && !dividend) {
            window.NightElf.api({
                appName: 'hzzTest',
                method: 'OPEN_PROMPT',
                chainId: 'AELF',
                hostname: 'aelf.io',
                payload: {
                    method: 'SET_PERMISSION',
                    payload: {
                        address: currentWallet.address,
                        contracts: [
                            {
                                chainId: 'AELF',
                                contractAddress: contracts.CONSENSUSADDRESS,
                                contractName: 'consensus',
                                description: 'contract consensus'
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
    });
}
