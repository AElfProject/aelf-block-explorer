/**
 * @file getNightElfAddressList
 * @author zhouminghui
*/

import {commonPrivateKey, APPNAME} from '../../config/config';
import {message} from 'antd';

export default function getNightElfAddressList() {
    window.NightElf.api({
        appName: APPNAME,
        method: 'GET_ADDRESS'
    }).then(result => {
        let showWallet = null;
        if (result.error !== 0) {
            let wallet = {
                address: '',
                name: '',
                privateKey: commonPrivateKey,
                publicKey: ''
            };
            localStorage.setItem('currentWallet', JSON.stringify(wallet));
            message.warning(result.errorMessage.message, 5);
            showWallet = false;
        }
        else if (result.addressList.length !== 0) {
            localStorage.setItem('walletInfoList', JSON.stringify(result.addressList));
            if (localStorage.currentWallet === undefined) {
                localStorage.setItem('currentWallet', JSON.stringify(result.addressList[0]));
            }
            if (JSON.parse(localStorage.currentWallet).name === '') {
                localStorage.setItem('currentWallet', JSON.stringify(result.addressList[0]));
            }
            showWallet = true;
        }
        else {
            let wallet = {
                address: '',
                name: '',
                privateKey: commonPrivateKey,
                publicKey: ''
            };
            localStorage.setItem('currentWallet', JSON.stringify(wallet));
            showWallet = false;
        }
        this.setState({
            showWallet,
            currentWallet: JSON.parse(localStorage.currentWallet),
            walletInfoList: result.addressList
        });
    });
}