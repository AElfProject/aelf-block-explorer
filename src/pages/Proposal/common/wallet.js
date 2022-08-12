/**
 * @file wallet related
 * @author atom-yang
 */
import Extension from './extension';

const WALLET_TYPE = {
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

const walletInstance = new Wallet({
  walletType: 'EXTENSION',
});

export default walletInstance;
