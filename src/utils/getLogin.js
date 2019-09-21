/**
 * @file getLogin.js
 * @author zhouminghui
*/
import { CHAIN_ID } from '@src/constants';
import config from '../../config/config';

export default function getLogin(nightElf, payload, callback) {
    const {
        appName
    } = payload;
    console.log('payload', payload);
    nightElf.login({
        appName,
        payload: {
            method: 'LOGIN',
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
            }]
        }
    }, (error, result) => {
        if (result) {
            callback(result);
        }
    });
}
