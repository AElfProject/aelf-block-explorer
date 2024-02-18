import { skip } from 'node:test';
import {
  Address,
  CollectionDetailData,
  CollectionHoldersData,
  CollectionInventoryData,
  CollectionTransfer,
  CollectionTransfersData,
  HolderItem,
  InventoryItem,
  InventorySymbol,
} from './type';
import Logo from 'public/next.svg';

const transferList: CollectionTransfer[] = Array.from(new Array(100).keys()).map((item, i) => {
  const mockCollectionTransfer: CollectionTransfer = {
    transactionHash: '0x1234567890abcdef' + i,
    status: 'success',
    method: 'transfer',
    timestamp: '2022-01-01T00:00:00Z',
    from: {
      name: 'Alice',
      address: '0xabcdef1234567890',
      addressType: 1,
      isManager: false,
      isProducer: true,
    },
    to: {
      name: 'Bob',
      address: '0x7890abcdef123456',
      addressType: 2,
      isManager: true,
      isProducer: false,
    },
    value: 100,
    item: {
      symbol: 'NFT',
      name: 'My NFT',
      imageUrl: 'https://etherscan.io/token/images/boredapeyc_32.png',
    },
  };
  return mockCollectionTransfer;
});
export interface TransfersQueryParams {
  chainId: string; // 主链/侧链
  skipCount: number;
  maxResultCount: number;
  symbol: string;
  search?: string; // 搜索 Address、Txn Hash、Symbol
}
// { page, pageSize }
async function fetchTransferList(params: TransfersQueryParams): Promise<CollectionTransfersData> {
  console.log('fetchTransferList', params);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    transfers: transferList.slice(params.skipCount, params.maxResultCount),
  };
}

const holderList: HolderItem[] = Array.from(new Array(100).keys()).map((item, i) => {
  const mockAddress: Address = {
    name: 'Alice',
    address: '0xabcdef1234567890' + i,
    addressType: 1,
    isManager: false,
    isProducer: true,
  };
  const mockHolder: HolderItem = {
    address: mockAddress,
    quantity: '100',
    percentage: '10%',
  };
  return mockHolder;
});
interface HolderQueryParams {
  chainId: string; // 主链/侧链
  skipCount: number;
  maxResultCount: number;
  symbol: string;
}
async function fetchHolderData(p: HolderQueryParams): Promise<CollectionHoldersData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    holders: holderList.slice(p.skipCount, p.maxResultCount),
  };
}

const overview: CollectionDetailData = {
  nftCollection: {
    name: 'My NFT Collection',
    imageUrl: 'https://etherscan.io/token/images/boredapeyc_32.png',
    symbol: 'NFT',
  },
  items: 1000,
  holders: 500,
  totalTransfers: '10000',
  floorPriceInUsd: 10.5,
  floorAmount: 1,
  contractAddress: '0x1234567890abcdef',
};

const fetchOverviewData = async (): Promise<CollectionDetailData> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return overview;
};

const inventoryItemList: InventoryItem[] = Array.from(new Array(100).keys()).map((item, i) => {
  const mockCollectionItem: InventorySymbol = {
    symbol: 'NFT',
    name: 'My NFT',
    imageUrl: 'https://etherscan.io/token/images/boredapeyc_32.png',
  };
  const mockInventoryItem: InventoryItem = {
    item: mockCollectionItem,
    lastSalePriceInUsd: 100.0,
    lastSaleAmount: 1,
    timestamp: '2022-01-01T00:00:00Z',
    transactionHash: '0x1234567890abcdef' + i,
  };
  return mockInventoryItem;
});

interface InventoryListParams {
  chainId: string; // 主链/侧链
  skipCount: number;
  maxResultCount: number;
  collection: string;
  search: string; // 搜索 Address、Symbol
}
async function fetchInventoryList(p: InventoryListParams): Promise<CollectionInventoryData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    inventory: inventoryItemList.slice(p.skipCount, p.maxResultCount),
  };
}
export {
  transferList,
  overview,
  holderList,
  inventoryItemList,
  fetchTransferList,
  fetchHolderData,
  fetchOverviewData,
  fetchInventoryList,
};
