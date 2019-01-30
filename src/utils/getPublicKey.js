/**
 * @file getPublicKey.js
 * @author zhouminghui
*/

import elliptic from 'elliptic';
let ec = new elliptic.ec('secp256k1');

export default function getPublicKey(publicKey) {
    return ec.keyFromPublic(publicKey, 'hex').getPublic().encode('hex');
}
