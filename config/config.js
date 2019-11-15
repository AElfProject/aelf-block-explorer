/**
 * @file config.js
 * @author huangzongzhe
 */
const config = require('./config.json');

// the block chain URL this explorer is serving
const BUILD_ENDPOINT = 'http://127.0.0.1:8000';

const DEFAUTRPCSERVER = `${location.protocol}//${location.host}/chain`;

const MAINCHAINID = 'AELF';
const APPNAME = 'explorer.aelf.io';
const commonPrivateKey = 'd351aa6e20d353c6a1bee1f4cba8dc6d79ba63e2799381ec9dc75398ed58828b';

const WALLET_DOMAIN = 'https://wallet-test.aelf.io/';
// const WALLET_DOMAIN = 'https://wallet-test-side01.aelf.io/';
// const WALLET_DOMAIN = 'https://wallet-test-side02.aelf.io/';


module.exports = {
    DEFAUTRPCSERVER,
    commonPrivateKey,
    MAINCHAINID,
    APPNAME,
    // The following variable are with suitable name
    WALLET_DOMAIN,
    BUILD_ENDPOINT,
    ...config
};
