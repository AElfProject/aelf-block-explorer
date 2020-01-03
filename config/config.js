/**
 * @file config.js
 * @author huangzongzhe
 */
const config = require('./config.json');

// the block chain URL this explorer is serving
const BUILD_ENDPOINT = 'http://13.231.179.27:8000';
const MAINCHAINID = 'AELF';
const ADDRESS_INFO = {
  PREFIX: 'ELF',
  CURRENT_CHAIN_ID: 'AELF'
};
// ChainId: AELF, Symbol: ELF，resource token
// ChainId: tDVV, Symbol: EPC (AElf public chain)
// ChainId: tDVW, Symbol: EDA (AElf developer support chain A)
// ChainId: tDVX, Symbol: EDB (AElf developer support chain B)
// ChainId: tDVY, Symbol: EDC (AElf developer support chain C)
// ChainId: tDVZ, Symbol: EDD (AElf developer support chain D)
const CHAINS_LINK = {
  AELF: 'https://explorer-test.aelf.io',
  tDVV: 'https://explorer-test-side01.aelf.io',
  tDVW: 'https://explorer-test-side02.aelf.io',
  tDVX: 'https://explorer-test-side03.aelf.io',
  tDVY: 'https://explorer-test-side04.aelf.io',
  tDVZ: 'https://explorer-test-side05.aelf.io'
};
const CHAINS_LINK_NAMES = {
  AELF: 'Main chain AELF',
  tDVV: 'Side chain tDVV',
  tDVW: 'Side chain tDVW',
  tDVX: 'Side chain tDVX',
  tDVY: 'Side chain tDVY',
  tDVZ: 'Side chain tDVZ'
};
const WALLET_DOMAIN = 'https://wallet-test.aelf.io/';
const APPNAME = 'explorer.aelf.io';
const commonPrivateKey = 'd351aa6e20d353c6a1bee1f4cba8dc6d79ba63e2799381ec9dc75398ed58828b';
const DEFAUTRPCSERVER = `${location.protocol}//${location.host}/chain`;

module.exports = {
  DEFAUTRPCSERVER,
  commonPrivateKey,
  MAINCHAINID,
  APPNAME,
  ADDRESS_INFO,
  CHAINS_LINK,
  CHAINS_LINK_NAMES,
  // The following variable are with suitable name
  WALLET_DOMAIN,
  BUILD_ENDPOINT,
  ...config
};
