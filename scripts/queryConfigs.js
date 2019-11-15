// polyfill
global.location = {};
const AElf = require('aelf-sdk');
const fs = require('fs');
const path = require('path');
const config = require('../config/config.json');
const mergedConfig = require('../config/config.js');

const endpoint = mergedConfig.BUILD_ENDPOINT;
const aelf = new AElf(new AElf.providers.HttpProvider(endpoint));
const wallet = AElf.wallet.getWalletByPrivateKey(mergedConfig.commonPrivateKey);

const result = {
    ...config
};

async function getConfig() {
    const {
        CONTRACTS
    } = config;
    const {
        ChainId,
        GenesisContractAddress
    } = await aelf.chain.getChainStatus();
    result.CHAIN_ID = ChainId;
    const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, wallet);
    for (const [key, name] of Object.entries(CONTRACTS)) {
        const contractAddress = await zeroContract.GetContractAddressByName.call(AElf.utils.sha256(name));
        result[key] = contractAddress;
        if (name === 'AElf.ContractNames.Token') {
            const contract = await aelf.chain.contractAt(contractAddress, wallet);
            const {
                symbol
            } = await contract.GetNativeTokenInfo.call();
            result.SYMBOL = symbol;
        }
    }
    console.log(result);
    fs.writeFileSync(path.resolve('./config/config.json'), `${JSON.stringify(result, null, 2)}\n`);
}

getConfig().catch(console.error);
