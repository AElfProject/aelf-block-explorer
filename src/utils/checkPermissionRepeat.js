
/**
 * @file checkPermissionRepeat.js
 * @author zhouminghui
*/

import config from '../../config/config';
import setNewPermission from './setNewPermission';

export default function checkPermissionRepeat(nightElf, payload, callback) {
    const {
        appName,
        result,
        connectChain
    } = payload;
    const {permissions} = result;
    const {address} = permissions[0];
    callback();
    const connectChainStr = JSON.stringify(config);
    const permission = result.permissions.map(item => {
        if (item.appName === appName) {
            return item;
        }
    });
    console.log('permission', permission);
    permission[0].contracts.map(item => {
        if (connectChainStr.indexOf(item.contractAddress) === -1) {
            setNewPermission(nightElf, appName, connectChain, address);
        }
    });
}