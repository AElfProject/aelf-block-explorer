import AElf from "aelf-sdk";

const { ellipticEc } = AElf.wallet;

export function getPublicKey(publicKey) {
    return ellipticEc.keyFromPublic(publicKey, 'hex').getPublic().encode('hex');
}

export function getPublicKeyFromObject(publicKey) {
    try {
        return ellipticEc.keyFromPublic(publicKey).getPublic('hex');
    } catch (e) {
        return '';
    }
}
