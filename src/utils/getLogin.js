/**
 * @file getLogin.js
 * @author zhouminghui
*/
import { CHAIN_ID } from '@src/constants';
import config from '../../config/config';

// todo: there are three place that has the same payload in contractChange, getLogin, setNewPermission, can I optimize it?
export default function getLogin(nightElf, payload, callback) {
    nightElf.login({
        appName: config.APPNAME,
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
            }, {
                chainId: CHAIN_ID,
                contractAddress: config.electionContractAddr,
                contractName: 'Election',
                description: 'contract Election',
                github: ''
            }, {
                chainId: CHAIN_ID,
                contractAddress: config.profitContractAddr,
                contractName: 'Profit',
                description: 'contract Profit',
                github: ''
            }]
        }
    }, (error, result) => {
        if (result) {
            callback(result);
        }
    });
}
