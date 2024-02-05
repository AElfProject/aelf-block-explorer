import { IToken } from '@_types/common';

export interface ITokensTableItem {
  rank: number;
  token: IToken;
  totalSupply: string;
  circulatingSupply: string;
  holders: number;
  holderPercentChange24h: number;
}

export interface ITokensTableData {
  total: number;
  list: ITokensTableItem[];
}
