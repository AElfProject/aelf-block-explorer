/**
 * @file config.js
 * @author huangzongzhe
 */
// Basic
// TODO: 用getContractNameByAddress获取
// TODO: get address by conract name 
// const consensusDPoS = 'AElf.ContractNames.Consensus';
// Huang said that the way get address by contract name spend two ajax, it's not proper to excute it in FE.
// But I remembered that it don't have to cost two ajax in aelf-command.

const DEFAUTRPCSERVER = `${location.protocol}//${location.host}/chain`;

const MAINCHAINID = 'AELF';
const APPNAME = 'explorer.aelf.io';
const commonPrivateKey = 'd351aa6e20d353c6a1bee1f4cba8dc6d79ba63e2799381ec9dc75398ed58828b';

// others 
const SYMBOL = 'ELF';
const CHAIN_ID = 'AELF';

const WALLET_DOMAIN = 'https://wallet-test.aelf.io/';
// const WALLET_DOMAIN = 'https://wallet-test-side01.aelf.io/';
// const WALLET_DOMAIN = 'https://wallet-test-side02.aelf.io/';

// Vote
const voteContractAddr = 'xw6U3FRE5H8rU3z8vAgF9ivnWSkxULK5cibdZzMC9UWf7rPJf';
// Election
const electionContractAddr = '2J9wWhuyz7Drkmtu9DTegM9rLmamjekmRkCAWz5YYPjm7akfbH';
// Profit
const profitContractAddr = 'jDpXvpfC2qpriNFgZh68nRpJ5juN51ehcJNJwAcr5Z1UhfFTJ';
// Token
const multiToken = '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB';
// Treasury
const dividends = 'WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM'; 
// Consensus
const consensusDPoS = 'RnQLF2SnJL9HLzBPtpzuPkDeLK34b9su7gtZ5TzVFvKP26DHw';
// TokenConverter
const tokenConverter = 'SkMGjviAAs9bnYvv6cKcafbhf6tbRGQGK93WgKvZoCoS5amMK';
// Shoulde be Token
const feeReceiverContract = '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB';


module.exports = {
    DEFAUTRPCSERVER,
    commonPrivateKey,
    multiToken,
    dividends,
    tokenConverter,
    consensusDPoS,
    MAINCHAINID,
    feeReceiverContract,
    APPNAME,
    // The following variable are with suitable name
    voteContractAddr,
    electionContractAddr,
    profitContractAddr,
    WALLET_DOMAIN,
    CHAIN_ID,
    SYMBOL
};
