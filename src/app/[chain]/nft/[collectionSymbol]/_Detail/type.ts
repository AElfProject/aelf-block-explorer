import { IToken } from '@_types/common';
import { ISearchProps } from 'aelf-design';

// Collection detail api return type

export interface CollectionDetailData {
  nftCollection: IToken;
  items: number;
  holders: number;
  transferCount: number;
  floorPriceOfUsd: number;
  floorPrice: number;
  tokenContractAddress: string;
}

export interface CollectionDetailApiResponse {
  code: string;
  message: string;
  data: CollectionDetailData;
}
// Transfer
export interface CollectionTransferItemProperty {
  symbol: string;
  name: string;
  imageUrl: string;
}
export interface CollectionTransfer {
  transactionHash: string;
  status: string;
  method: string;
  timestamp: string;
  from: {
    name: string;
    address: string;
    addressType: number;
    isManager: boolean;
    isProducer: boolean;
  };
  to: {
    name: string;
    address: string;
    addressType: number;
    isManager: boolean;
    isProducer: boolean;
  };
  value: number;
  item: CollectionTransferItemProperty;
}
export interface CollectionTransfersData {
  total: number;
  transfers: CollectionTransfer[];
}
export interface CollectionTransfersApiResponse {
  code: string;
  message: string;
  data: CollectionTransfersData;
}

// Holder
export interface Address {
  name: string;
  address: string;
  addressType: number;
  isManager: boolean;
  isProducer: boolean;
}

export interface HolderItem {
  address: Address;
  quantity: string;
  percentage: string;
}

export interface CollectionHoldersData {
  total: number;
  holders: HolderItem[];
}

export interface CollectionHoldersApiResponse {
  code: string;
  message: string;
  data: CollectionHoldersData;
}

// wqw
export interface InventorySymbol {
  symbol: string;
  name: string;
  imageUrl: string;
}
export interface InventoryItem {
  item: InventorySymbol;
  lastSalePriceInUsd: number;
  lastSaleAmount: number;
  timestamp: string;
  transactionHash: string;
}
export interface CollectionInventoryData {
  total: number;
  inventory: InventoryItem[];
}

export interface CollectionInventoryApiResponse {
  code: string;
  message: string;
  data: CollectionInventoryData;
}

export const URL_QUERY_KEY = 'a';

export const PAGE_SIZE = 25;

export interface ITableSearch extends ISearchProps {
  value: string;
  onSearchChange: (value: string) => void;
  onClear?: () => void;
  // onPressEnter?: (value: string) => void;
}
