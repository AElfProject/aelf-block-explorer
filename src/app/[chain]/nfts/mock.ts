import { INFTsTableData, INFTsTableItem } from './type';

const nftsList: INFTsTableItem[] = Array.from(new Array(100).keys()).map((key) => ({
  rank: key,
  nftCollection: {
    name: 'ELF',
    symbol: 'ELF',
    imageUrl:
      'https://ewell-testnet.s3.ap-northeast-1.amazonaws.com/1707185337825-9ccfd284d9a0301a256ce6ed13e56329.jpeg',
  },
  items: 100000,
  holders: 2345,
  itemList: [
    {
      symbol: 'ELF',
      count: 1000,
    },
  ],
}));

export default async function fetchData({ page, pageSize }): Promise<INFTsTableData> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    total: 10000,
    list: nftsList.slice((page - 1) * pageSize, page * pageSize),
  };
}
