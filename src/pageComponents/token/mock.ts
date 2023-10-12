import { ITokenData } from './type';
const overview = {
  tokenLogo: 'https://raw.githubusercontent.com/AElf-devops/token-list/master/assets/ELF/logo.svg',
  tokenName: 'ELF',
  tokenSymbol: 'ELF',
  totalSupply: '1000000000',
  holders: 7005,
  holderPercentChange24h: 0.0913,
  totalTransfers: '3139022',
  priceInUsd: 0.17,
  pricePercentChange24h: 12.1,
  contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  decimals: 8,
};
const transfers = Array.from(new Array(100).keys()).map((item) => {
  return {
    transactionHash: '09522399bb6e2d5edfc4e7229b79e398dbb85864536510611f3be9c16cdba78d',
    status: '',
    method: 'Transfer',
    timestamp: '1660926192826',
    from: 'd41uXjj7AmvDjkCU9bvfWpZdYEjpVyxmTBSc6fsdkB2L4dGos',
    to: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    quantity: 44444444444444,
  };
});
const holders = Array.from(new Array(100).keys()).map((item) => {
  return {
    rank: item + 1,
    address: '2LNg7aSwwigGWaisUzKjSGdijV9Y6jdtJqrD2PWX3ZQQ2HqsSa',
    quantity: 872553739.6078365,
    percentage: 87.2554,
    value: '872553739.6078365',
  };
});
const data = {
  ...overview,
  transfers: {
    total: 100,
    list: transfers,
  },
  holders: {
    total: 100,
    list: holders,
  },
};
export default async function fetchData({ page, pageSize }): Promise<ITokenData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return data;
}
