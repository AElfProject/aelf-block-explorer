export interface IOverviewSSR {
  tokenPriceInUsd: number;
  tokenPricePercent: string;
  transactions: string;
  tps: string;
  reward: string;
  blockHeight: number;
  accounts: number;
  citizenWelfare: string;
}
export interface IProducer {
  name: string;
  address: string;
}
export interface IBlockItem {
  blockHeight: number;
  timestamp: string;
  txns: number;
  reward: string;
  producer: IProducer;
}
export interface ITransactionItem {
  id: number;
  transactionHash: string;
  from: string;
  to: string;
  timestamp: number;
  txnValue: number;
}
