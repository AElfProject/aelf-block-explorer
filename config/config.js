/**
 * @file config.js
 * @author huangzongzhe
 */
const config = require('./config.json');

// the block chain URL this explorer is serving

const BUILD_ENDPOINT = 'http://3.25.10.185:8000';
const MAINCHAINID = 'AELF';
const ADDRESS_INFO = {
  PREFIX: 'ELF',
  CURRENT_CHAIN_ID: 'AELF'
};
const CHAINS_LINK = {
  AELF: 'https://explorer-tju.hoopox.com',
  tDVV: 'https://tdvv-explorer-tju.hoopox.com'
};
const CHAINS_LINK_NAMES = {
  AELF: 'Main chain AELF',
  tDVV: 'Side chain tDVV'
};
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
  BUILD_ENDPOINT,
  ...config
};
