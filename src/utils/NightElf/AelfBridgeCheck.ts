/**
 * @file AelfBridgeCheck
 * @author hzz780
 */

import { DEFAUTRPCSERVER } from 'constants/config/config';

let AElfBridge: any = null;
if (typeof window !== 'undefined') {
  AElfBridge = require('aelf-bridge');
}
import { getObjectPublicKeyFromString, getPublicKeyFromObject } from '../getPublicKey';

const HTTP_PROVIDER = DEFAUTRPCSERVER;
let aelfBridgeInstance: any = null;
// let aelfInstanceByExtension = null;
let aelfInstanceByBridge: any = null;
let contractInstances = {};

let accountInfo: any = null;

export default class AelfBridgeCheck {
  check;
  constructor() {
    // let resovleTemp = null;
    this.check = new Promise((resolve, reject) => {
      const bridgeInstance = new AElfBridge({
        timeout: 3000,
      });
      bridgeInstance.connect().then((isConnected) => {
        // console.log('NightElfCheck.getInstance() 22', isConnected);
        if (isConnected) {
          resolve(true);
        } else {
          reject({
            error: 200001,
            message: 'timeout, please use AELF Wallet APP or open the page in PC',
          });
        }
      });
      setTimeout(() => {
        reject({
          error: 200001,
          message: 'timeout, please use AELF Wallet APP or open the page in PC',
        });
      }, 3000);
    });
  }

  static getInstance() {
    if (!aelfBridgeInstance) {
      aelfBridgeInstance = new AelfBridgeCheck();
      return aelfBridgeInstance;
    }
    return aelfBridgeInstance;
  }

  // For extension users
  static getAelfInstanceByExtension() {
    if (!aelfInstanceByBridge) {
      AelfBridgeCheck.resetContractInstances();
      // AelfBridgeCheck.initAelfInstanceByExtension();
      AelfBridgeCheck.initAelfInstanceByExtension();
    }
    return aelfInstanceByBridge;
  }

  static initAelfInstanceByExtension() {
    aelfInstanceByBridge = new AElfBridge({
      // endpoint: 'https://explorer.aelf.io/chain' //HTTP_PROVIDER
      endpoint: HTTP_PROVIDER,
    });

    // support async/await & callback
    aelfInstanceByBridge.login = async (param, callback) => {
      if (!accountInfo) {
        const result = await aelfInstanceByBridge.account();
        const account = JSON.parse(JSON.stringify(result.accounts[0]));

        const pubKeyString = account.publicKey.match('"x"')
          ? getPublicKeyFromObject(JSON.parse(account.publicKey))
          : account.publicKey;
        const pubKeyObject = account.publicKey.match('"x"')
          ? JSON.parse(account.publicKey)
          : getObjectPublicKeyFromString(account.publicKey);
        account.pubkey = pubKeyString;
        account.publicKey = pubKeyObject;
        accountInfo = {
          detail: JSON.stringify(account),
        };
      }

      callback(null, {
        ...accountInfo,
        error: 0,
        message: '',
      });
      return accountInfo;
    };
    // 钱包APP目前没有切换钱包的功能
    aelfInstanceByBridge.logout = (param, callback) => {
      accountInfo = null;
      callback();
      return true;
    };
    return aelfInstanceByBridge;
  }

  static resetContractInstances() {
    contractInstances = {};
  }

  // singleton to get, new to init
  static async initContractInstance(inputInitParams) {
    const { contractAddress } = inputInitParams;
    const aelf = AelfBridgeCheck.getAelfInstanceByExtension();
    if (!accountInfo) {
      throw Error('Please login');
    }
    const { address } = JSON.parse(accountInfo.detail);

    const contractInstance = await aelf.chain.contractAt(contractAddress);
    contractInstances[contractAddress + address] = contractInstance;
    return contractInstance;
  }
}
