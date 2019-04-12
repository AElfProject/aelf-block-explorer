/**
 * @file setNewPermission.js
 * @author zhouminghui
*/

import {message} from 'antd';
import config from '../../config/config';
export default function setNewPermission(nightElf, payload) {
    const {
        appName,
        address
    } = payload;
    nightElf.setContractPermission({
        appName,
        chainId: 'AELF',
        payload: {
            address,
            contracts: [{
                chainId: 'AELF',
                contractAddress: config.multiToken,
                contractName: 'Token',
                description: 'contract Token',
                github: ''
            }, {
                chainId: 'AELF',
                contractAddress: config.dividends,
                contractName: 'Dividend',
                description: 'contract Dividend',
                github: ''
            }, {
                chainId: 'AELF',
                contractAddress: config.consensusDPoS,
                contractName: 'Consensus.Dpos',
                description: 'contract Consensus',
                github: ''
            }, {
                chainId: 'AELF',
                contractAddress: config.tokenConverter,
                contractName: 'Token Converter',
                description: 'contract Token Converter',
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

