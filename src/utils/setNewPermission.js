/**
 * @file setNewPermission.js
 * @author zhouminghui
*/
import { CHAIN_ID } from '@src/constants';
import {message} from 'antd';
import config from '../../config/config';
export default function setNewPermission(nightElf, payload) {
    const {
        appName,
        address
    } = payload;
    console.log('<<<<<payload', payload)
    console.log('config.electionContractAddr', config.electionContractAddr)
    nightElf.setContractPermission({
        appName,
        chainId: CHAIN_ID,
        payload: {
            address,
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
            }]
        }
    }, (error, result) => {
        if (result && result.error === 0) {
            message.success('Update Permission success!!', 3);
        }
        else {
            message.error(result.errorMessage.message, 3);
        }
    });
}

