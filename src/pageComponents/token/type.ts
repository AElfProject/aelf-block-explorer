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
export interface ITransfer {
  transactionHash: string;
  status: string;
  method: string;
  timestamp: string;
  from: string;
  to: string;
  quantity: number;
}
export interface IHolder {
  rank: number;
  address: string;
  quantity: number;
  percentage: number;
  value: string;
}

export interface IOverviewData {
  tokenLogo: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  holderPercentChange24h: number;
  totalTransfers: string;
  priceInUsd: number;
  pricePercentChange24h: number;
  contractAddress: string;
  decimals: number;
}
export interface ITransfers {
  total: number;
  list: ITransfer[];
}
export interface IHolders {
  total: number;
  list: IHolder[];
}
export interface ITokenData extends IOverviewData {
  transfers: ITransfers;
  holders: IHolders;
}
