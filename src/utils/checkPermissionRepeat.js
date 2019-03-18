
/**
 * @file checkPermissionRepeat.js
 * @author zhouminghui
*/

import setNewPermission from './setNewPermission';
export default function checkPermissionRepeat(payload, callback) {
    const {
        appName,
        result,
        connectChain
    } = payload;
    const {permissions} = result;
    const {address} = permissions[0];
    callback(address);
    const connectChainStr = JSON.stringify(connectChain);
    const permission = result.permissions.map(item => {
        if (item.appName === appName) {
            return item;
        }
    });
    permission[0].contracts.map(item => {
        if (connectChainStr.indexOf(item.contractAddress) === -1) {
            setNewPermission(appName, connectChain, address);
        }
    });
}