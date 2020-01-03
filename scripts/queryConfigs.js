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
        CONTRACTS,
        schemeIds
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
    if (result.electionContractAddr) {
        const profit = await aelf.chain.contractAt(result.profitContractAddr, wallet);
        const electionSchemeIds = (await profit.GetManagingSchemeIds.call({
            manager: result.electionContractAddr
        })).schemeIds;
        const treasurySchemaIds = (await profit.GetManagingSchemeIds.call({
            manager: result.dividends
        })).schemeIds;
        const schemes = [
            electionSchemeIds[1],
            electionSchemeIds[0],
            treasurySchemaIds[3],
            treasurySchemaIds[2],
            treasurySchemaIds[4]
        ].map((v, i) => ({
            type: schemeIds[i].type,
            schemeId: v
        }));
        result.schemeIds = schemes;
    }
    console.log(result);
    fs.writeFileSync(path.resolve('./config/config.json'), `${JSON.stringify(result, null, 2)}\n`);
}

getConfig().catch(console.error);
