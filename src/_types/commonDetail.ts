export type TokenTransfersItemType = {
  transactionHash: string;
  status: string;
  method: string;
  timestamp: string;
  from: string; // name+address
  to: string; // name+address
  transferStatus: string; //in/out
  amount: string;
  token: string;
};

export interface ITokenTransfers {
  total: number;
  list: TokenTransfersItemType[];
}

export type TokensListItemType = {
  asset: string;
  symbol: string;
  quantity: string;
  balance: string;
  priceInUsd: number;
  pricePercentChange24h: number;
  totalPriceInUsd: number;
};

export interface ITokens {
  assetInUsd: number;
  assetPercentChange24h: number;
  assetInElf: number;
  total: number;
  list: TokensListItemType[];
}

export type NftsItemType = {
  item: string;
  collection: string;
  quantity: string;
  timestamp: string;
};

export interface INfts {
  total: number;
  list: NftsItemType[];
}

export type TransactionsItemType = {
  transactionHash: string;
  status: string;
  method: string;
  blockHeight: string;
  timestamp: string;
  from: string; //name+address
  to: string; //name+address
  txnValue: number;
  txnFee: number;
};

export interface ITransactions {
  total: number;
  list: TransactionsItemType[];
}

export type NftTransfersItemType = {
  transactionHash: string;
  status: string;
  method: string;
  timestamp: string;
  from: string; // name+address
  to: string; // name+address
  transferStatus: string; //in/out
  amount: string;
  item: string;
};

export interface INftTransfers {
  total: number;
  list: NftTransfersItemType[];
}

export interface IAddressResponse {
  symbol: string;
  tokenBalance: string;
  tokenPriceInUsd: number;
  tokenTotalPriceInUsd: number;
  tokenHoldings: number; //
  contractName: string; // contract address
  author: string; // contract add
  lastTxnSend: string; //CA/EOA address add
  firstTxnSend: string; //CA/EOA address add
  tokens: ITokens;
  nfts: INfts;
  transactions: ITransactions;
  tokenTransfers: ITokenTransfers;
  nftTransfers: INftTransfers;
}

export enum TitleEnum {
  Address = 'Address',
  Contract = 'Contract',
}
