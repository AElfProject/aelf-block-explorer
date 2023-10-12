import { ITokensData } from './type';
const tokens = Array.from(new Array(100).keys()).map((item) => {
  return {
    rank: 1 + item,
    tokenLogo: 'ELF',
    tokenName: 'ELF',
    tokenSymbol: 'ELF',
    totalSupply: '1,000,000,000',
    circulatingSupply: '988,793,890.353',
    holders: 7002,
    holderPercentChange24h: -0.003,
  };
});
export default async function fetchData({ page, pageSize }): Promise<ITokensData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    list: tokens.slice((page - 1) * pageSize, page * pageSize),
  };
}
