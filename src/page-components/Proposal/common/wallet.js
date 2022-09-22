/**
 * @file wallet related
 * @author atom-yang
 */
import dynamic from 'next/dynamic';
// const Extension = dynamic(() => import('./extension'), { ssr: false });
import Extension from './extension';

let WALLET_TYPE = {
  EXTENSION: Extension,
};

export class Wallet {
  constructor(options = {}) {
    this.options = {
      ...options,
    };
    this.proxy = new WALLET_TYPE[options.walletType](this.options);
    this.isExist = this.proxy.isExist;
  }

  getExtensionInfo() {
    return this.proxy.elfInstance.getExtensionInfo();
  }

  login(...args) {
    return this.proxy.login(...args);
  }

  logout(...args) {
    return this.proxy.logout(...args);
  }

  sign(...args) {
    return this.proxy.sign(...args);
  }

  invoke(...args) {
    return this.proxy.invoke(...args);
  }
}

let walletInstance = null;
export function walletInstanceSingle() {
  if (!walletInstance) {
    walletInstance = new Wallet({
      walletType: 'EXTENSION',
    });
  }
  return walletInstance;
}

export default walletInstance;
