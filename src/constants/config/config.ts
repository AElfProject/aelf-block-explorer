/**
 * @file config.js
 * @author huangzongzhe
 */
// only used in server
export let config: any =
  process.env.CHAIN_ID === 'AELF' ? require('../platform/AELF').default : require('../platform/tDVW').default;
// only used in client
if (typeof window !== 'undefined') {
  const host = location.host;
  if (host.includes('tDVW') || host.includes('side02')) {
    config = require('../platform/tDVW').default;
  } else {
    config = require('../platform/AELF').default;
  }
}
// the block chain URL this explorer is serving

export const MAINCHAINID = 'AELF';
// MAIN TESTNET
export const NETWORK_TYPE = 'TESTNET' as string;
// ChainId: AELF
// ChainId: tDVV(AElf public chain)
export const CHAINS_LINK = {
  AELF: 'https://explorer-test.aelf.io',
};
export const CHAINS_LINK_NAMES = {
  AELF: 'Main chain AELF',
};
export const WALLET_DOMAIN = 'https://wallet-test.aelf.io/';
export const APPNAME = 'explorer.aelf.io';
export const commonPrivateKey = '0000000000000000000000000000000000000000000000000000000000000001';
export const DEFAUTRPCSERVER =
  typeof window !== 'undefined' ? `${window?.location?.protocol}//${window?.location?.host}/chain` : '/chain';
// const DEFAUTRPCSERVER = `https://explorer-test.aelf.io/chain`;
module.exports = {
  DEFAUTRPCSERVER,
  commonPrivateKey,
  MAINCHAINID,
  NETWORK_TYPE,
  APPNAME,
  CHAINS_LINK,
  CHAINS_LINK_NAMES,
  // The following variable are with suitable name
  WALLET_DOMAIN,
  ...config,
};

export default {
  DEFAUTRPCSERVER,
  commonPrivateKey,
  MAINCHAINID,
  NETWORK_TYPE,
  APPNAME,
  CHAINS_LINK,
  CHAINS_LINK_NAMES,
  // The following variable are with suitable name
  WALLET_DOMAIN,
  ...config,
} as any;
