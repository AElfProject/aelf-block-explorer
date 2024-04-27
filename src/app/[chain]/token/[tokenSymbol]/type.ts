import { IFromInfo } from '@_api/type';
import { IToken } from '@_types/common';

export interface ITransferItem {
  transactionId: string;
  status: string;
  method: string;
  blockHeight: string;
  blockTime: string;
  from: IFromInfo;
  to: IFromInfo;
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
  address: IFromInfo;
  quantity: string;
  percentage: string;
  value: string;
}

export interface IHolderTableData {
  total: number;
  list: IHolderItem[];
}

export interface ITokenSearchProps {
  searchType: SearchType;
  onSearchInputChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  search?: string;
  searchText?: string;
}
export type TTransferSearchData = Pick<ITransferTableData, 'balance' | 'value'>;
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

export interface ITokenListItem {
  holders: number;
  totalSupply: number;
  circulatingSupply: number;
  holderPercentChange24H: number;
  token: IToken;
}

export interface ITokenList {
  total: number;
  list: ITokenListItem[];
}

export enum SearchType {
  txHash = 'txHash',
  address = 'address',
  other = 'other',
}
