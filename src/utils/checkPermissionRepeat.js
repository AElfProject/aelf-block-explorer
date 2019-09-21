
/**
 * @file checkPermissionRepeat.js
 * @author zhouminghui
 * @description callback() is equivalent to executing this.getNightElfKeypair(wallet) in Resourc/Resource.js;
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
    const connectChainStr = JSON.stringify(config);
    console.log('appName', appName, result.permissions);
    const permission = result.permissions.map(item => {
        if (item.appName === appName) {
            return item;
        }
    });
    console.log('permission', permission);
    permission[0].contracts.map(item => {
        if (connectChainStr.indexOf(item.contractAddress) === -1) {
            setNewPermission(nightElf, { appName, connectChain, address });
        }
    });
    callback();
}
