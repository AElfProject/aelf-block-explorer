/**
 * @file NightElfCheck
 * @author zhouminghui
 */
import { DEFAUTRPCSERVER, APPNAME } from 'constants/config/config';

let nightElfInstance: any = null;
let aelfInstanceByExtension = null;
export default class NightElfCheck {
  check;
  constructor() {
    let resovleTemp: any = null;
    this.check = new Promise((resolve, reject) => {
      if (window.NightElf) {
        console.log('There is nightelf');
        resolve(true);
      }
      setTimeout(() => {
        reject({
          error: 200001,
          message: 'timeout',
        });
      }, 5000);
      resovleTemp = resolve;
    });
    document.addEventListener('NightElf', () => {
      resovleTemp(true);
    });
  }

  static getInstance() {
    if (!nightElfInstance) {
      nightElfInstance = new NightElfCheck();
      return nightElfInstance;
    }
    return nightElfInstance;
  }

  // For extension users
  static getAelfInstanceByExtension() {
    if (!aelfInstanceByExtension) {
      NightElfCheck.initAelfInstanceByExtension();
    }
    return aelfInstanceByExtension;
  }

  static initAelfInstanceByExtension() {
    aelfInstanceByExtension = new window.NightElf.AElf({
      httpProvider: [DEFAUTRPCSERVER],
      APPNAME,
    });
    return aelfInstanceByExtension;
  }
}
