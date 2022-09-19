import AElf from 'aelf-sdk';

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

export function getObjectPublicKeyFromString(publicKey) {
  try {
    return {
      x: publicKey.slice(2, 66),
      y: publicKey.slice(66, 130),
    };
  } catch (e) {
    return '';
  }
}
