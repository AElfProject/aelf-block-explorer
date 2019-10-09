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

const DEFAUTRPCSERVER = location.protocol + '//' + location.host + '/chain';
// const DEFAUTRPCSERVER =  'http://13.231.179.27:8000';
// const DEFAUTRPCSERVER =  'http://192.168.197.18:8000';
// const DEFAUTRPCSERVER =  'http://127.0.0.1:8000';
// const DEFAUTRPCSERVER =  'http://127.0.0.1:1235';
// const DEFAUTRPCSERVER =  'http://52.195.10.165:8000';
// const DEFAUTRPCSERVER =  'http://54.202.235.179:8000';
// const DEFAUTRPCSERVER =  'http://18.212.240.254:8000'; // 不删档节点
// const DEFAUTRPCSERVER =  'http://192.168.197.14:8000'; // 本地测试节点
const MAINCHAINID = 'AELF';
const APPNAME = 'explorer.aelf.io';
const commonPrivateKey = 'd351aa6e20d353c6a1bee1f4cba8dc6d79ba63e2799381ec9dc75398ed58828b';

const WALLET_DOMAIN = 'https://wallet-test.aelf.io/';
// const WALLET_DOMAIN = 'https://wallet-test-side01.aelf.io/';
// const WALLET_DOMAIN = 'https://wallet-test-side02.aelf.io/';

// todo: use the variable in config.js instead
const ELF_DECIMAL = 100000000;

// const SYMBOL = 'ELF';
// const CHAIN_ID = 'AELF';
// 本地测试节点的合约地址
// // Token
// const multiTokenContractAddr = '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB';
// // Dividend
// const dividendContractAddr = 'WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM'; // Yiqi said that dividend's address is treasury's address.
// // Consensus
// const consensusContractAddr = 'RnQLF2SnJL9HLzBPtpzuPkDeLK34b9su7gtZ5TzVFvKP26DHw';
// // Vote
// const voteContractAddr = 'xw6U3FRE5H8rU3z8vAgF9ivnWSkxULK5cibdZzMC9UWf7rPJf';
// // Election
// const electionContractAddr = '2J9wWhuyz7Drkmtu9DTegM9rLmamjekmRkCAWz5YYPjm7akfbH';
// // TokenConverter
// const tokenConverterContractAddr = 'SkMGjviAAs9bnYvv6cKcafbhf6tbRGQGK93WgKvZoCoS5amMK';
// // Profit
// const profitContractAddr = 'jDpXvpfC2qpriNFgZh68nRpJ5juN51ehcJNJwAcr5Z1UhfFTJ';

// 不删档节点的合约地址
// Token
const multiTokenContractAddr = 'mS8xMLs9SuWdNECkrfQPF8SuRXRuQzitpjzghi3en39C3SRvf'; // 不删档地址
// Consensus
const consensusContractAddr = 'ZCP9k7YPHgeMM1XF94BjayULQ6hm3E5QFrsXxuPfUtJFz6sGP';
// TokenConverter
const tokenConverterContractAddr = 'oqBFyjdWqZF6QKhVfBGmxA5Xz2mVJdC6jERdyC11EELjGSp5x'; // 不删档地址
// Election
const electionContractAddr = '2UCCiUjrKwgJgRcPaiFp6roaZ1bvRK1vbUtS4HTjkucEsBq63o';
// Profit
const profitContractAddr = 'GUR3tTR7ngqzFfQ2m2i54fXSSEu1D9a179FRxba3UDaykQ2YX';
// Dividend
const dividendContractAddr = 'SPz98hADSEraugrYoqcciJyUX1iNGxgsamMyvkdReSyC2Y9o3'; // Yiqi said that dividend's address is treasury's address.
// Vote
const voteContractAddr = 'sCbDeD2FxdPvtX5ykepazKf8NDACuhgpDCq6TMt5uEnoPaRzN';

// 不删档节点
const SYMBOL = 'TELF';
const CHAIN_ID = 'TELF';


// For compatibility the code use unsuitable name
const multiToken = multiTokenContractAddr;
const dividends = dividendContractAddr; 
const consensusDPoS = consensusContractAddr;
const tokenConverter = tokenConverterContractAddr;
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
    multiTokenContractAddr,
    dividendContractAddr,
    consensusContractAddr,
    voteContractAddr,
    electionContractAddr,
    profitContractAddr,

    WALLET_DOMAIN,
    CHAIN_ID,
    SYMBOL,
    ELF_DECIMAL
};
