/**
 * @file getWallet.js
 * @author zhouminghui
*/
import * as Aelf from 'aelf-sdk';

export default function getWallet(privateKey) {
    const wallet = Aelf.wallet.getWalletByPrivateKey(privateKey);
    return wallet;
}

