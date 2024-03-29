// polyfill
global.location = {};
const AElf = require("aelf-sdk");
const fs = require("fs");
const path = require("path");
const config = require("../config/config.json");
const mergedConfig = require("../config/config.js");
const axios = require("axios");
const host = process.argv[process.argv.indexOf("--CHAIN_ENDPOINT") + 1];
const aelf = new AElf(
  new AElf.providers.HttpProvider(
    process.argv[process.argv.indexOf("--CHAIN_ENDPOINT") + 1]
  )
);
const wallet = AElf.wallet.getWalletByPrivateKey(mergedConfig.commonPrivateKey);
const result = {
  ...config,
};
async function getConfig() {
  const { CONTRACTS, schemeIds } = config;
  const { ChainId, GenesisContractAddress } = await aelf.chain.getChainStatus();
  result.CHAIN_ID = ChainId;
  const zeroContract = await aelf.chain.contractAt(
    GenesisContractAddress,
    wallet
  );
  for (const [key, name] of Object.entries(CONTRACTS)) {
    const contractAddress = await zeroContract.GetContractAddressByName.call(
      AElf.utils.sha256(name)
    );
    result[key] = contractAddress;
    if (name === "AElf.ContractNames.Token") {
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
    const profit = await aelf.chain.contractAt(
      result.profitContractAddr,
      wallet
    );
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
  fs.writeFileSync(
    path.resolve("./config/config.json"),
    `${JSON.stringify(result, null, 2)}\n`
  );
}

// enum netWorkType: MAIN | TESTNET
// get cms data
async function getCMS() {
  try {
    const res = await axios({
      method: "get",
      url: "https://test-cms.aelf.io/cms/chain-list-by-networks",
      params: {
        // populate: "chain",
        // "filters[netWorkType][$eq]": mergedConfig.NETWORK_TYPE,
        netWorkType: mergedConfig.NETWORK_TYPE,
      },
    });
    const data = res?.data?.[0] ?? {};
    fs.writeFileSync(
      path.resolve("./config/configCMS.json"),
      `${JSON.stringify(data, null, 2)}\n`
    );
  } catch (error) {
    throw error;
  }
}

const contractNames = [
  {
    name: "Token",
    description: "contract Token",
    contractName: "AElf.ContractNames.Token",
  },
  {
    name: "Dividend",
    description: "contract Dividend",
    contractName: "AElf.ContractNames.Treasury",
  },
  {
    name: "Consensus.Dpos",
    description: "contract Consensus",
    contractName: "AElf.ContractNames.Consensus",
  },
  {
    name: "Token Converter",
    description: "contract Token Converter",
    contractName: "AElf.ContractNames.TokenConverter",
  },
  {
    name: "Election",
    description: "contract Election",
    contractName: "AElf.ContractNames.Election",
  },
  {
    name: "Profit",
    description: "contract Profit",
    contractName: "AElf.ContractNames.Profit",
  },
  {
    name: "Parliament",
    description: "contract Parliament",
    contractName: "AElf.ContractNames.Parliament",
  },
  {
    name: "Association",
    description: "contract Association",
    contractName: "AElf.ContractNames.Association",
  },
  {
    name: "Referendum",
    description: "contract Referendum",
    contractName: "AElf.ContractNames.Referendum",
  },
  {
    name: "CrossChain",
    description: "contract CrossChain",
    contractName: "AElf.ContractNames.CrossChain",
  },
];

async function getContractAddress() {
  const aelf = new AElf(new AElf.providers.HttpProvider(host));
  const wallet = AElf.wallet.createNewWallet();
  const { ChainId, GenesisContractAddress } = await aelf.chain.getChainStatus();
  let result = {
    chainId: ChainId,
  };
  const zeroContract = await aelf.chain.contractAt(
    GenesisContractAddress,
    wallet
  );
  const list = await Promise.all(
    contractNames.map(async (item) => {
      const { contractName, name, ...left } = item;
      try {
        const address = await zeroContract.GetContractAddressByName.call(
          AElf.utils.sha256(contractName)
        );
        return {
          ...left,
          contractAddress: address,
          contractName: name,
        };
      } catch (e) {
        return {
          ...left,
          contractAddress: "",
          contractName: name,
        };
      }
    })
  ).then((results) => results.filter((item) => item.contractAddress));
  console.log(list);
  result = {
    ...result,
    contractAddress: [
      {
        contractName: "Genesis",
        description: "contract Genesis",
        contractAddress: GenesisContractAddress,
      },
      ...list,
    ],
  };
  const originResult = JSON.parse(
    fs
      .readFileSync(path.resolve(__dirname, "../config/viewer/config.json"))
      .toString()
  );
  result = {
    ...originResult,
    viewer: {
      ...originResult.viewer,
      ...result,
    },
  };
  fs.writeFileSync(
    path.resolve(__dirname, "../config/viewer/config.json"),
    `${JSON.stringify(result, null, 2)}\n`
  );
}

getCMS().catch(console.error);

getConfig().catch(console.error);

// for viewer
(async () => {
  await getContractAddress();
})();
