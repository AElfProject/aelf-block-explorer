/**
 * @file config.js
 * @author huangzongzhe
 */
const config = require('./config.json');

// the block chain URL this explorer is serving

const BUILD_ENDPOINT = process.env.CHAIN_ENDPOINT;
const MAINCHAINID = 'AELF';
// MAIN TESTNET
const NETWORK_TYPE = 'TESTNET';
// ChainId: AELF
// ChainId: tDVV(AElf public chain)
const CHAINS_LINK = {
  AELF: 'https://explorer-test.aelf.io'
};
const CHAINS_LINK_NAMES = {
  AELF: 'Main chain AELF'
};
const WALLET_DOMAIN = 'https://wallet-test.aelf.io/';
const APPNAME = 'explorer.aelf.io';
const commonPrivateKey = '0000000000000000000000000000000000000000000000000000000000000001';
const DEFAUTRPCSERVER = `${location.protocol}//${location.host}/chain`;

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
  BUILD_ENDPOINT,
  ...config
};
