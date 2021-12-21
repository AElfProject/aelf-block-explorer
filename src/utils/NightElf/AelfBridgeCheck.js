/**
 * @file AelfBridgeCheck
 * @author hzz780
 */
// import {
//   HTTP_PROVIDER,
//   APPNAME,
// } from '../../constant/constant';

import config, {
  DEFAUTRPCSERVER,
  APPNAME,
} from '@config/config';

import AElfBridge from 'aelf-bridge';
import {getPublicKeyFromObject} from "../getPublicKey";

const HTTP_PROVIDER = DEFAUTRPCSERVER;
let aelfBridgeInstance = null;
// let aelfInstanceByExtension = null;
let aelfInstanceByBridge = null;
let contractInstances = {};

let accountInfo = null;

export default class AelfBridgeCheck {
  constructor() {
    // let resovleTemp = null;
    this.check = new Promise((resolve, reject) => {
      const bridgeInstance = new AElfBridge({
        timeout: 3000
      });
      bridgeInstance.connect().then(isConnected => {
        // console.log('NightElfCheck.getInstance() 22', isConnected);
        if (isConnected) {
          resolve(true);
        } else {
          reject({
            error: 200001,
            message: 'timeout, please use AELF Wallet APP or open the page in PC'
          });
        }
      });
      setTimeout(() => {
        // console.log('NightElfCheck.getInstance() setTimeout', false);
        reject({
          error: 200001,
          message: 'timeout, please use AELF Wallet APP or open the page in PC'
        });
      }, 3000);
    });
    // document.addEventListener('NightElf', result => {
    //   resovleTemp(true);
    // });
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
      endpoint: HTTP_PROVIDER
    });

    // support async/await & callback
    aelfInstanceByBridge.login = async (param, callback) => {
      if (!accountInfo) {
        const result = await aelfInstanceByBridge.account();
        const account = JSON.parse(JSON.stringify(result.accounts[0]));

        const pubKeyTemp = JSON.parse(account.publicKey);
        account.pubkey = getPublicKeyFromObject(pubKeyTemp);
        account.publicKey = pubKeyTemp;
        accountInfo = {
          detail: JSON.stringify(account)
        };
      }

      callback(null, {
        ...accountInfo,
        error: 0,
        message: ''
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

  static async getContractInstance(inputInitParams) {
    const {contractAddress} = inputInitParams;

    if (!accountInfo) {
      throw Error('Please login');
    }
    const address = JSON.parse(accountInfo.detail).address;

    if (contractInstances[contractAddress + address]) {
      return contractInstances[contractAddress + address];
    }
    return await NightElfCheck.initContractInstance(inputInitParams);
  }

  // singleton to get, new to init
  static async initContractInstance(inputInitParams) {
    const {contractAddress} = inputInitParams;
    const aelf = AelfBridgeCheck.getAelfInstanceByExtension();
    if (!accountInfo) {
      throw Error('Please login');
    }
    const address = JSON.parse(accountInfo.detail).address;

    const contractInstance = await aelf.chain.contractAt(contractAddress);
    contractInstances[contractAddress + address] = contractInstance;
    return contractInstance;
  }
}
