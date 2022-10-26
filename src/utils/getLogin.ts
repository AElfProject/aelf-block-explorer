/**
 * @file getLogin.js
 * @author zhouminghui
 */
import isMobile from 'ismobilejs';
import contracts from './contracts';
import config from 'constants/config/config';

const isPhone = typeof window !== 'undefined' ? isMobile(window.navigator).phone : false;

// todo: there are three place that has the same payload in contractChange, getLogin, can I optimize it?
let getLoginLock = false;
let getLoginQueue: any[] = [];
let getLoginTimer: ReturnType<typeof setTimeout> | null = null;
export default function getLogin(nightElf, payload, callback, useLock = true) {
  getLoginQueue.push({
    nightElf,
    payload,
    callback,
    useLock,
  });
  if (getLoginTimer) {
    clearTimeout(getLoginTimer);
  }
  getLoginTimer = setTimeout(() => {
    nightELFLogin(true);
  }, 200);
}

function nightELFLogin(useLock?) {
  if ((getLoginQueue.length <= 0 || getLoginLock) && useLock) {
    return;
  }
  if (!getLoginQueue.length) {
    return;
  }
  getLoginLock = true;

  // 钱包APP，取消登录没有返回信息，先简单处理一下
  // 浏览器插件，直接插掉，也没有返回信息
  setTimeout(
    () => {
      getLoginLock = false;
    },
    isPhone ? 5000 : 1500,
  );

  const param = getLoginQueue.shift();
  // const {nightElf, payload, callback, useLock} = param;
  const { nightElf, callback } = param;
  nightElf.login(
    {
      appName: config.APPNAME,
      payload: {
        method: 'LOGIN',
        contracts,
      },
    },
    (error, result) => {
      // console.log('this.getCurrentWalletLock getLogin', error, result, getLoginQueue.length);
      if (result) {
        callback(result);
        if (result.error === 200010) {
          getLoginQueue = [];
        }
      }
      getLoginLock = false;
      nightELFLogin();
    },
  );
}

//
// let getLoginBridgeQueue = [];
// let getLoginBridgeLock = false;
// let getLoginBridgeTimer = null;
// function getLoginBridge(nightElf, payload, callback, useLock = true) {
//     getLoginBridgeQueue.push({
//         nightElf, payload, callback, useLock
//     });
//     if (getLoginBridgeTimer) {
//         clearTimeout(getLoginBridgeTimer);
//     }
//     getLoginBridgeTimer = setTimeout(() => {
//         nightELFLoginBridge(true);
//     }, 200);
// }
//
// function nightELFLoginBridge(useLock) {
//     if ((getLoginBridgeQueue.length <= 0 || getLoginBridgeLock) && useLock) {
//         return;
//     }
//     if (!getLoginBridgeQueue.length) {
//         return;
//     }
//     getLoginBridgeLock = true;
//
//     // 钱包APP，取消登录没有返回信息，先简单处理一下
//     setTimeout(() => {
//         getLoginBridgeLock = false;
//     }, 1000);
//
//     const param = getLoginBridgeQueue.shift();
//     const {nightElf, callback} = param;
//     nightElf.login({
//         appName: config.APPNAME,
//         payload: {
//             method: 'LOGIN',
//             contracts
//         }
//     }, (error, result) => {
//         if (result) {
//             callback(result);
//             if (result.error === 200010) {
//                 getLoginBridgeQueue = [];
//             }
//         }
//         getLoginBridgeLock = false;
//         nightELFLoginBridge();
//     });
// }
