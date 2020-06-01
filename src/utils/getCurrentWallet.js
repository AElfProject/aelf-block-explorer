import {getPublicKeyFromObject} from "./getPublicKey";

const getCurrentWallet = () => {
  let currentWallet = JSON.parse(localStorage.getItem('currentWallet'));
  if (currentWallet !== null && currentWallet.publicKey) {
    currentWallet.pubKey = getPublicKeyFromObject(currentWallet.publicKey);
  } else {
    currentWallet = {
      address: null,
      name: null,
      pubKey: {
        x: null,
        y: null
      }
    };
  }
  return currentWallet;
};

export default getCurrentWallet;
