import { ITokensTableData, ITokensTableItem } from './type';

const tokensList: ITokensTableItem[] = Array.from(new Array(100).keys()).map((key) => ({
  rank: key,
  token: {
    name: 'ELF',
    symbol: 'ELF1234567890987654323456eweweewesdsdsdsddsdsddd',
    imageUrl: '',
  },
  totalSupply: '100000',
  circulatingSupply: '5000',
  holders: 2345,
  holderPercentChange24h: -0.003,
}));

export default async function fetchData({ page, pageSize }): Promise<ITokensTableData> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    total: 10000,
    list: tokensList.slice((page - 1) * pageSize, page * pageSize),
  };
}
