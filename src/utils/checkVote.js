/**
 *
 * @file checkVote.js
 * @author zhouminghui
 * 没有在用该方法
*/

import {APPNAME} from '../../config/config';

export default function checkVote(contracts, currentWallet) {
    return window.NightElf.api({
        appName: APPNAME,
        method: 'CHECK_PERMISSION',
        type: 'address', // if you did not set type, it aways get by domain.
        address: currentWallet.address
    }).then(result => {
        if (result.permissions.length === 0) {
            window.NightElf.api({
                appName: APPNAME,
                method: 'OPEN_PROMPT',
                chainId: 'AELF',
                hostname: 'aelf.io',
                payload: {
                    method: 'SET_PERMISSION',
                    payload: {
                        address: currentWallet.address,
                        contracts: [{
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
                        }]
                    }
                }
            }).then(result => {
                if (result.error === 0) {
                    window.NightElf.api({
                        appName: APPNAME,
                        method: 'CHECK_PERMISSION',
                        type: 'contract', // if you did not set type, it aways get by domain.
                        contractAddress: contracts.CONSENSUSADDRESS
                    }).then(result => {
                        console.log('>>>>>>>>>>>>>>>>>>>', result);
                    });
                }
                else {

                }
            });
        }
    });
}