/**
 * @file config.js
 * @author huangzongzhe
 */
let config; // = require('../platform/AELF').default;
if (typeof window !== 'undefined') {
  const host = location.host;
  if (host.includes('tDVW')) {
    config = require('../platform/tDVW').default;
  } else {
    config = require('../platform/AELF').default;
  }
}
const getConfig = (headers) => {
  const host = headers.host;
  if (host.includes('tDVW')) {
    config = require('../platform/tDVW').default;
  } else {
    config = require('../platform/AELF').default;
  }
  return config;
};
// the block chain URL this explorer is serving

const MAINCHAINID = 'AELF';
// MAIN TESTNET
const NETWORK_TYPE = 'TESTNET';
// ChainId: AELF
// ChainId: tDVV(AElf public chain)
const CHAINS_LINK = {
  AELF: 'https://explorer-test.aelf.io',
};
const CHAINS_LINK_NAMES = {
  AELF: 'Main chain AELF',
};
const WALLET_DOMAIN = 'https://wallet-test.aelf.io/';
const APPNAME = 'explorer.aelf.io';
const commonPrivateKey = '0000000000000000000000000000000000000000000000000000000000000001';
const DEFAUTRPCSERVER =
  typeof window !== 'undefined' ? `${window?.location?.protocol}//${window?.location?.host}/chain` : '/chain';
// const DEFAUTRPCSERVER = `https://explorer-test.aelf.io/chain`;
module.exports = {
  getConfig,
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
