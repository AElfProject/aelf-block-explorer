/**
 * @file config.js
 * @author huangzongzhe
 */
const config = require('./config.json');

// the block chain URL this explorer is serving

const BUILD_ENDPOINT = process.env.CHAIN_ENDPOINT;
const MAINCHAINID = 'AELF';
// ChainId: AELF
// ChainId: tDVV(AElf public chain)
const CHAINS_LINK = {
  AELF: 'https://explorer-tju.hoopox.com',
  tDVV: 'https://tdvv-explorer-tju.hoopox.com'
};
const CHAINS_LINK_NAMES = {
  AELF: 'Main chain AELF',
  tDVV: 'Side chain tDVV'
};
const WALLET_DOMAIN = 'https://wallet-test.aelf.io/';
const APPNAME = 'explorer.aelf.io';
const commonPrivateKey = '0000000000000000000000000000000000000000000000000000000000000001';
const DEFAUTRPCSERVER = `${location.protocol}//${location.host}/chain`;

module.exports = {
  DEFAUTRPCSERVER,
  commonPrivateKey,
  MAINCHAINID,
  APPNAME,
  CHAINS_LINK,
  CHAINS_LINK_NAMES,
  // The following variable are with suitable name
  WALLET_DOMAIN,
  BUILD_ENDPOINT,
  ...config
};
