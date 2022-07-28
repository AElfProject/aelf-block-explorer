// polyfill
global.location = {};
const AElf = require('aelf-sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const config = require('../config/config.json');
const mergedConfig = require('../config/config.js');
const axios = require('axios');

dotenv.config('../.env');

const aelf = new AElf(new AElf.providers.HttpProvider(process.env.CHAIN_ENDPOINT));
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
            let resourceTokens = await contract.GetResourceTokenInfo.call();
            resourceTokens = Array.isArray(resourceTokens.value)
                ? resourceTokens.value.map(({symbol, decimals}) => ({
                    symbol,
                    decimals
                })) : [];
            result.SYMBOL = symbol;
            result.resourceTokens = resourceTokens;
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
    result.genesisContract = GenesisContractAddress;
    console.log(result);
    fs.writeFileSync(path.resolve('./config/config.json'), `${JSON.stringify(result, null, 2)}\n`);
}

// enum netWorkType: MAIN | TESTNET
// get cms data
async function getCMS() {
    try {
        const res = await axios({
            method: "get",
            url: "https://test-cms.aelf.io/chain-list-by-networks",
            params: {
                // populate: "chain",
                // "filters[netWorkType][$eq]": mergedConfig.NETWORK_TYPE,
                netWorkType:  mergedConfig.NETWORK_TYPE
            },
            });
            const data =  res?.data?.[0] ?? {};
            fs.writeFileSync(path.resolve('./config/configCMS.json'), `${JSON.stringify(data, null, 2)}\n`);
        } catch (error) {
            throw error;
        }
}

getCMS().catch(console.error);

getConfig().catch(console.error);
