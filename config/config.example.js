/**
 * @file config.js
 * @author huangzongzhe
 */
// Basic
const DEFAUTRPCSERVER = location.protocol + '//' + location.host + '/chain';
const MAINCHAINID = 'AELF';
const APPNAME = 'explorer.aelf.io';
const commonPrivateKey = 'd351aa6e20d353c6a1bee1f4cba8dc6d79ba63e2799381ec9dc75398ed58828b';
// Contract Address
const multiToken = '2J9wWhuyz7Drkmtu9DTegM9rLmamjekmRkCAWz5YYPjm7akfbH';
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
