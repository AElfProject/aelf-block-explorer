/**
 * @file getLogin.js
 * @author zhouminghui
*/
import { CHAIN_ID } from '@src/constants';
import config from '../../config/config';

// todo: there are three place that has the same payload in contractChange, getLogin, setNewPermission, can I optimize it?
let getLoginLock = false;
let getLoginQueue = [];

export default function getLogin(nightElf, payload, callback, useLock = true) {
    getLoginQueue.push({
        nightElf, payload, callback, useLock
    });
    setTimeout(() => {
        nightELFLogin();
    }, 0);
}

function nightELFLogin() {
    if (getLoginQueue.length <= 0 || getLoginLock) {
        return;
    }
    getLoginLock = true;
    const param = getLoginQueue.shift();
    const {nightElf, payload, callback, useLock} = param;
    nightElf.login({
        appName: config.APPNAME,
        payload: {
            method: 'LOGIN',
            contracts: [{
                chainId: CHAIN_ID,
                contractAddress: config.genesisContract,
                contractName: 'Genesis',
                description: 'contract Genesis',
                github: ''
            }, {
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
            }, {
                chainId: CHAIN_ID,
                description: 'contract Parliament',
                contractAddress: config.parliamentContract,
                contractName: 'Parliament',
                github: ''
            }, {
                chainId: CHAIN_ID,
                description: 'contract Association',
                contractAddress: config.associationContract,
                contractName: 'Association',
                github: ''
            }, {
                chainId: CHAIN_ID,
                description: 'contract Referendum',
                contractAddress: config.referendumContract,
                contractName: 'Referendum',
                github: ''
            }, {
                chainId: CHAIN_ID,
                description: 'contract CrossChain',
                contractAddress: config.crossChainContract,
                contractName: 'CrossChain',
                github: ''
            }]
        }
    }, (error, result) => {
        // console.log('this.getCurrentWalletLock getLogin', error, result, getLoginQueue.length);
        if (result) {
            callback(result);
            if (result.error === 200010) {
                getLoginQueue = [];
            }
        }
        getLoginLock = false;
        nightELFLogin();
    });
}
