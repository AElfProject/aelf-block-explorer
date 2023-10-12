export interface ITableData {
  rank: number;
  tokenLogo: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  circulatingSupply: string;
  holders: number;
  holderPercentChange24h: number;
}

export interface ITokensData {
  total: number;
  list: ITableData[];
}
