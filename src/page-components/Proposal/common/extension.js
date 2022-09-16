/**
 * @file NightElfCheck
 * @author zhouminghui
 */
import dynamic from 'next/dynamic';
let AElfBridge = null;
if (typeof window !== 'undefined') {
  AElfBridge = require('aelf-bridge');
}

import Promise from 'core-js-pure/actual/promise';
// import { getPublicKeyFromObject } from 'utils/utils';
import { getPublicKeyFromObject } from 'utils/utils';
import contants from './constants';

const { viewer, APP_NAME, DEFAUT_RPCSERVER } = contants;

const contracts = viewer.contractAddress.map((v) => ({
  ...v,
  chainId: viewer.chainId,
  github: '',
}));

export default class Extension {
  static instance = null;

  constructor(options) {
    if (Extension.instance) {
      return Extension.instance;
    }
    this.options = {
      ...options,
    };
    this.currentWallet = {};
    this.contracts = {};
    this.elfInstance = null;
    this.elfType = null; // extension app
    this.account = null;

    this.isExist = Promise.any([this.isExtensionExist(), this.isAelfBridgeExist()])
      .then((first) => first)
      .catch(() => false);

    Extension.instance = this;
  }

  isExtensionExist() {
    return new Promise((resolve) => {
      if (window.NightElf || window.parent.NightElf) {
        resolve(true);
        this.elfType = 'extension';
      } else {
        document.addEventListener('NightElf', () => {
          resolve(true);
          this.elfType = 'extension';
        });
        setTimeout(() => {
          resolve(!!(window.NightElf || window.parent.NightElf));
        }, 5000);
      }
    })
      .then((result) => {
        if (result) {
          this.elfInstance = new (window.NightElf || window.parent.NightElf).AElf({
            httpProvider: [DEFAUT_RPCSERVER],
            appName: APP_NAME,
          });
        }
        return result;
      })
      .catch(() => false);
  }

  isAelfBridgeExist() {
    return new Promise((resolve) => {
      const bridgeInstance = new AElfBridge({
        timeout: 3000,
      });
      bridgeInstance.connect().then((isConnected) => {
        if (isConnected) {
          resolve(true);
          this.elfType = 'app';
        }
      });
      setTimeout(() => {
        resolve(false);
      }, 5000);
    })
      .then((result) => {
        if (result) {
          this.elfInstance = new AElfBridge({
            endpoint: DEFAUT_RPCSERVER,
          });
        }
        return result;
      })
      .catch(() => false);
  }

  async loginAelfBridge() {
    if (Object.keys(this.currentWallet).length) {
      console.log('this.currentWallet ready', this.currentWallet);
      return this.currentWallet;
    }

    const result = await this.elfInstance.account();
    const account = result.accounts[0];

    console.log('aelfInstanceByBridge account', account, JSON.stringify(result));

    this.currentWallet = {
      ...account,
      publicKey: account.publicKey.match('"x"')
        ? getPublicKeyFromObject(JSON.parse(account.publicKey))
        : account.publicKey,
    };

    this.elfInstance.chain.getChainStatus();
    console.log('this.currentWallet', this.currentWallet);
    return this.currentWallet;
  }

  async loginExtension() {
    return new Promise((resolve, reject) => {
      this.elfInstance.login(
        {
          appName: APP_NAME,
          payload: {
            method: 'LOGIN',
            contracts,
          },
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result && +result.error === 0) {
            let detail;
            try {
              detail = JSON.parse(result.detail);
            } catch (e) {
              detail = result.detail;
            }
            this.currentWallet = {
              ...detail,
              publicKey: getPublicKeyFromObject(detail.publicKey),
            };
            resolve(this.currentWallet);
          } else {
            reject(result);
          }
        },
      );
    }).then((result) => {
      this.elfInstance.chain.getChainStatus();
      console.log('this.currentWallet', this.currentWallet);
      return result;
    });
  }

  async login() {
    const isExist = await this.isExist;
    if (!isExist) {
      throw new Error('Plugin is not exist');
    }
    if (this.elfType === 'app') {
      return this.loginAelfBridge();
    }
    return this.loginExtension();
  }

  async logout(address) {
    if (this.elfType === 'app') {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.elfInstance
        .logout(
          {
            appName: APP_NAME,
            address,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              this.currentWallet = {};
              this.contracts = {};
              resolve(result);
            }
          },
        )
        .catch((error) => {
          reject(error);
        });
    });
  }

  /*
   * Todo: get signature from aelf bridge
   */
  sign(hex) {
    return this.elfInstance
      .getSignature({
        address: this.currentWallet.address,
        hexToBeSign: hex,
      })
      .then((result) => {
        if (result && +result.error === 0) {
          return result.signature;
        }
        throw result;
      });
  }

  async invoke(params) {
    const { contractAddress, param, contractMethod } = params;
    if (!this.contracts[contractAddress]) {
      const con = await this.elfInstance.chain.contractAt(contractAddress, {
        address: this.currentWallet.address,
      });
      this.contracts = {
        ...this.contracts,
        [contractAddress]: con,
      };
    }
    const contract = this.contracts[contractAddress];
    return contract[contractMethod](param);
  }
}
