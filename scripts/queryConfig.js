// polyfill
global.location = {};
const AElf = require('aelf-sdk');
const fs = require('fs');
const path = require('path');
const config = require('../src/constants/config/config.json');
const mergedConfig = require('../src/constants/config/config.js');
const axios = require('axios');
const host = process.argv[process.argv.indexOf('--CHAIN_ENDPOINT') + 1];
const result = {
  ...config,
};
const aelf = new AElf(new AElf.providers.HttpProvider(host));
const dotenv = require('dotenv');
dotenv.config();

async function getConfig() {
  const wallet = AElf.wallet.getWalletByPrivateKey(mergedConfig.commonPrivateKey);
  const { ChainId, GenesisContractAddress } = await aelf.chain.getChainStatus();
  const { CONTRACTS, schemeIds } = config;
  result.CHAIN_ID = ChainId;
  const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, wallet);
  for (const [key, name] of Object.entries(CONTRACTS)) {
    const contractAddress = await zeroContract.GetContractAddressByName.call(AElf.utils.sha256(name));
    result[key] = contractAddress;
    if (name === 'AElf.ContractNames.Token') {
      const contract = await aelf.chain.contractAt(contractAddress, wallet);
      const { symbol } = await contract.GetNativeTokenInfo.call();
      let resourceTokens = await contract.GetResourceTokenInfo.call();
      resourceTokens = Array.isArray(resourceTokens.value)
        ? resourceTokens.value.map(({ symbol, decimals }) => ({
            symbol,
            decimals,
          }))
        : [];
      result.SYMBOL = symbol;
      result.resourceTokens = resourceTokens;
    }
  }

  if (result.electionContractAddr) {
    const profit = await aelf.chain.contractAt(result.profitContractAddr, wallet);
    const electionSchemeIds = (
      await profit.GetManagingSchemeIds.call({
        manager: result.electionContractAddr,
      })
    ).schemeIds;
    const treasurySchemaIds = (
      await profit.GetManagingSchemeIds.call({
        manager: result.dividends,
      })
    ).schemeIds;
    const schemes = [
      electionSchemeIds[1],
      electionSchemeIds[0],
      treasurySchemaIds[3],
      treasurySchemaIds[2],
      treasurySchemaIds[4],
    ].map((v, i) => ({
      type: schemeIds[i].type,
      schemeId: v,
    }));
    result.schemeIds = schemes;
  }
  result.genesisContract = GenesisContractAddress;
  console.log(result);
  const ConfigUrl = 'src/constants/config/config.json';
  fs.writeFileSync(path.resolve(ConfigUrl), `${JSON.stringify(result, null, 2)}\n`);
}

// enum netWorkType: MAIN | TESTNET
// get cms data
async function getCMS() {
  const res = await axios({
    method: 'get',
    url: 'https://test-cms.aelf.io/cms/chain-list-by-networks',
    params: {
      // populate: "chain",
      // "filters[netWorkType][$eq]": mergedConfig.NETWORK_TYPE,
      netWorkType: mergedConfig.NETWORK_TYPE,
    },
  });
  const data = res?.data?.[0] ?? {};
  const ConfigCMSUrl = 'src/constants/config/configCMS.json';
  fs.writeFileSync(path.resolve(ConfigCMSUrl), `${JSON.stringify(data, null, 2)}\n`);
}

const contractNames = [
  {
    name: 'Token',
    description: 'contract Token',
    contractName: 'AElf.ContractNames.Token',
  },
  {
    name: 'Dividend',
    description: 'contract Dividend',
    contractName: 'AElf.ContractNames.Treasury',
  },
  {
    name: 'Consensus.Dpos',
    description: 'contract Consensus',
    contractName: 'AElf.ContractNames.Consensus',
  },
  {
    name: 'Token Converter',
    description: 'contract Token Converter',
    contractName: 'AElf.ContractNames.TokenConverter',
  },
  {
    name: 'Election',
    description: 'contract Election',
    contractName: 'AElf.ContractNames.Election',
  },
  {
    name: 'Profit',
    description: 'contract Profit',
    contractName: 'AElf.ContractNames.Profit',
  },
  {
    name: 'Parliament',
    description: 'contract Parliament',
    contractName: 'AElf.ContractNames.Parliament',
  },
  {
    name: 'Association',
    description: 'contract Association',
    contractName: 'AElf.ContractNames.Association',
  },
  {
    name: 'Referendum',
    description: 'contract Referendum',
    contractName: 'AElf.ContractNames.Referendum',
  },
  {
    name: 'CrossChain',
    description: 'contract CrossChain',
    contractName: 'AElf.ContractNames.CrossChain',
  },
];

async function getContractAddress() {
  const wallet = AElf.wallet.createNewWallet();
  const { ChainId, GenesisContractAddress } = await aelf.chain.getChainStatus();
  let result = {
    chainId: ChainId,
  };
  const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, wallet);
  const list = await Promise.all(
    contractNames.map(async (item) => {
      const { contractName, name, ...left } = item;
      try {
        const address = await zeroContract.GetContractAddressByName.call(AElf.utils.sha256(contractName));
        return {
          ...left,
          contractAddress: address,
          contractName: name,
        };
      } catch (e) {
        return {
          ...left,
          contractAddress: '',
          contractName: name,
        };
      }
    }),
  ).then((results) => results.filter((item) => item.contractAddress));
  console.log(list);
  result = {
    ...result,
    contractAddress: [
      {
        contractName: 'Genesis',
        description: 'contract Genesis',
        contractAddress: GenesisContractAddress,
      },
      ...list,
    ],
  };
  const ViewerConfigUrl = 'src/constants/config/viewer/config.json';
  const originResult = JSON.parse(fs.readFileSync(path.resolve(ViewerConfigUrl)).toString());
  result = {
    ...originResult,
    viewer: {
      ...originResult.viewer,
      ...result,
    },
  };
  fs.writeFileSync(path.resolve(ViewerConfigUrl), `${JSON.stringify(result, null, 2)}\n`);
}
function getProdRewrite() {
  const host = process.env.HOST;
  const pathArr = ['/api/:path*', '/cms/:path*', '/chain/:path*', '/socket'];
  const res = [];
  pathArr.forEach((ele) => {
    let obj = {};
    obj.source = ele;
    obj.destination = `${host}${ele}`;
    res.push(obj);
  });
  const source = '/api/blockChain/:path*';
  res.unshift({
    source,
    destination: `${host}/chain${source}`,
  });
  const prodRewriteUrl = 'build/rewrites/production.js';
  fs.writeFileSync(path.resolve(prodRewriteUrl), `module.exports = ${JSON.stringify(res, null, 2)}\n`);
}
Promise.all([getCMS(), getConfig(), getContractAddress(), getProdRewrite()]).catch(console.error);
