/**
 * @file config.js
 * @author huangzongzhe
 */
// Basic
// TODO: 用getContractNameByAddress获取
const DEFAUTRPCSERVER = location.protocol + '//' + location.host + '/chain';
const MAINCHAINID = 'AELF';
const APPNAME = 'explorer.aelf.io';
const commonPrivateKey = 'd351aa6e20d353c6a1bee1f4cba8dc6d79ba63e2799381ec9dc75398ed58828b';
// Contract Address
const multiToken = 'WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM';
const tokenConverter = 'Acv7j84Ghi19JesSBQ8d56XenwCrJ5VBPvrS4mthtbuBjYtXR';
const feeReceiverContract = '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB';
const dividends = '3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9';
const consensusDPoS = '3sXEJQhEYUXaYgtdX4aePekYeM8yTkgtQ4T1wff2XhawjF6';

module.exports = {
    DEFAUTRPCSERVER,
    commonPrivateKey,
    multiToken,
    dividends,
    tokenConverter,
    consensusDPoS,
    MAINCHAINID,
    feeReceiverContract,
    APPNAME
};
