/**
 * @file testingResource
 * @author zhouminghui
 */

import {resourceAddress} from '../../config/config';
import {message} from 'antd';
export default function testingResource(values, contracts, currentWallet) {
    return new Promise((resolve, reject) => {
        console.log(values);
        let contract = JSON.stringify(values.permissions[0].contracts);
        let resource = false;
        if (contract.indexOf(resourceAddress) === -1) {
            resource = true;
        }

        if (resource) {
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
                                contractAddress: resourceAddress,
                                contractName: 'resource',
                                description: 'resource consensus'
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

        if (!resource) {
            resolve(true);
        }
    });
}
