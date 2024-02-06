import { IToken } from '@_types/common';

export interface ITransferItem {
  transactionHash: string;
  status: string;
  method: string;
  blockHeight: string;
  timestamp: string;
  from: string;
  to: string;
  quantity: number;
}

export interface ITransferTableData {
  isAddress: boolean;
  balance: number;
  value: number;
  total: number;
  list: ITransferItem[];
}

export interface IHolderItem {
  address: string;
  quantity: string;
  percentage: string;
  value: string;
}

export interface IHolderTableData {
  total: number;
  list: IHolderItem[];
}

export interface ITokenDetail {
  token: IToken;
  totalSupply: string;
  circulatingSupply: string;
  holders: number;
  holderPercentChange24h: number;
  totalTransfers: string;
  priceInUsd: number;
  pricePercentChange24h: number;
  contractAddress: string;
  decimals: number;
}

export enum SearchType {
  txHash = 'txHash',
  address = 'address',
  other = 'other',
}
