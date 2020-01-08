/**
 * @file getLogin.js
 * @author zhouminghui
*/
import { CHAIN_ID } from '@src/constants';
import config from '../../config/config';

// todo: there are three place that has the same payload in contractChange, getLogin, setNewPermission, can I optimize it?
let getLoginLock = false;
// TODO: 整个获取都要重写, 后续试试 文件id + callbackArray = [f,f,f]
export default function getLogin(nightElf, payload, callback, useLock = true) {
    if(getLoginLock && useLock) {
        return;
    }
    getLoginLock = true;
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
        getLoginLock = false;
        if (result) {
            callback(result);
        }
    });
}
