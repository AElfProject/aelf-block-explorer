/**
 * @file getLogin.js
 * @author zhouminghui
*/

export default function getLogin(payload, callback) {
    const {
        appName,
        connectChain
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
                    contractAddress: connectChain['AElf.Contracts.Token'],
                    contractName: 'Token',
                    description: 'contract Token'
                }, {
                    chainId: 'AELF',
                    contractAddress: connectChain['AElf.Contracts.Dividends'],
                    contractName: 'Dividends',
                    description: 'contract Dividends'
                }, {
                    chainId: 'AELF',
                    contractAddress: connectChain['AElf.Contracts.Consensus.DPoS'],
                    contractName: 'Consensus.Dpos',
                    description: 'contract Consensus'
                },
                {
                    chainId: 'AELF',
                    contractAddress: connectChain['AElf.Contracts.Resource'],
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