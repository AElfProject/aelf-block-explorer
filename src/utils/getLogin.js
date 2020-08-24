/**
 * @file getLogin.js
 * @author zhouminghui
*/
import contracts from "./contracts";
import config from '../../config/config';

// todo: there are three place that has the same payload in contractChange, getLogin, setNewPermission, can I optimize it?
let getLoginLock = false;
let getLoginQueue = [];

export default function getLogin(nightElf, payload, callback, useLock = true) {
    getLoginQueue.push({
        nightElf, payload, callback, useLock
    });
    setTimeout(() => {
        nightELFLogin(useLock);
    }, 0);
}

function nightELFLogin(useLock) {
    if ((getLoginQueue.length <= 0 || getLoginLock) && useLock) {
        return;
    }
    if (!getLoginQueue.length) {
        return;
    }
    getLoginLock = true;
    const param = getLoginQueue.shift();
    // const {nightElf, payload, callback, useLock} = param;
    const {nightElf, callback} = param;
    nightElf.login({
        appName: config.APPNAME,
        payload: {
            method: 'LOGIN',
            contracts
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
