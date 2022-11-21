export interface ITokenInfo {
  id?: number;
  contractAddress?: string;
  symbol?: string;
  chainId?: string;
  issueChainId?: string;
  txId?: string;
  name?: string;
  totalSupply?: number;
  supply?: number;
  decimals?: number;
  holders?: number;
  transfers?: string;
}
export interface IOverviewProps {
  tokenInfo: ITokenInfo;
  price: number;
}
