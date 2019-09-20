const currentWallet = JSON.parse(localStorage.getItem('currentWallet'));
const pubKey = '04' + currentWallet.publicKey.x + currentWallet.publicKey.y;
const { address, name: walletName } = currentWallet;

export default currentWallet;
export { pubKey, address, walletName };
