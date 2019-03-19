/**
 * @file setNewPermission.js
 * @author zhouminghui
*/

import {message} from 'antd';
export default function setNewPermission(payload) {
    const {
        appName,
        connectChain,
        address
    } = payload;
    window.NightElf.api({
        appName,
        method: 'OPEN_PROMPT',
        chainId: 'AELF',
        hostname: 'aelf.io',
        payload: {
            // 在中间层会补齐
            // appName: 'hzzTest',
            // method 使用payload的
            // chainId: 'AELF',
            // hostname: 'aelf.io',
            payload: {
                method: 'SET_CONTRACT_PERMISSION',
                address,
                contracts: [{
                    chainId: 'AELF',
                    contractAddress: connectChain['AElf.Contracts.MultiToken'],
                    contractName: 'token',
                    description: 'token contract'
                }, {
                    chainId: 'AELF',
                    contractAddress: connectChain['AElf.Contracts.Dividend'],
                    contractName: 'dividend',
                    description: 'contract dividend'
                }, {
                    chainId: 'AELF',
                    contractAddress: connectChain['AElf.Contracts.Consensus.Dpos'],
                    contractName: 'consensus',
                    description: 'contract consensus'
                },
                {
                    chainId: 'AELF',
                    contractAddress: connectChain['AElf.Contracts.Resource'],
                    contractName: 'resource',
                    description: 'contract resource'
                }]
            }
        }
    }).then(result => {
        if (result && result.error === 0) {
            message.success('Update Permission success!!', 3);
        }
        else {
            message.error(result.errorMessage.message, 3);
        }
    });
}

