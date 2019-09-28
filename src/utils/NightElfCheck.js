/**
 * @file NightElfCheck
 * @author zhouminghui
*/

let nightElfInstance = null;
export default class NightElfCheck {
    constructor() {
        let resovleTemp = null;
        this.check = new Promise((resolve, reject) => {
            if (window.NightElf) {
                console.log('There is nightelf')
                resolve(true);
            }
            setTimeout(() => {
                reject({
                    error: 200001,
                    message: 'timeout'
                });
            }, 10000);
            resovleTemp = resolve;
        });
        document.addEventListener('NightElf', result => {
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
}
