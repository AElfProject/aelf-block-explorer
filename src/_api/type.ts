import { ILogsProps } from '@_components/LogsContainer/type';
import { StatusEnum } from '@_types/status';

export type TChainID = 'AELF' | 'tDVV' | 'tDVW';

export interface IBurntFee {
  usdFee: number;
  elfFee: number;
}

export interface IProducer {
  address: string;
  name: string;
}

export interface IFromInfo {
  name: string;
  address: string;
  addressType: number;
  isManager: boolean;
  isProducer: boolean;
}

export interface ITransactionsRequestParams {
  chainId: TChainID;
  transactionId: string;
  blockHeight: number;
  skipCount: number;
  maxResultCount: number;
}

export interface ITransactionsResponseItem {
  transactionId: string;
  status: StatusEnum;
  method: string;
  blockHeight: number;
  timestamp: string;
  from: IFromInfo;
  to: IFromInfo;
  transactionValue: string;
  transactionFee: string;
}

export interface ITransactionsResponse {
  total: number;
  transactions: ITransactionsResponseItem[];
}

export interface ITransactionDetailRequestParams {
  chainId: TChainID;
  transactionId: string;
  blockHeight: number;
}

export interface IBlocksRequestParams {
  chainId: TChainID;
  blockHeight: number;
  skipCount: number;
  maxResultCount: number;
}

export interface IBlocksResponseItem {
  blockHeight: number;
  timestamp: string;
  transactionCount: number;
  timeSpan: string;
  reward: string;
  producerName: string;
  producerAddress: string;
  burntFee: string;
}

export interface IBlocksResponse {
  total: number;
  blocks: IBlocksResponseItem[];
}

export interface IBlocksDetailRequestParams {
  chainId: TChainID;
  blockHeight: number;
}

export interface IBlocksDetailData {
  blockHeight: number;
  timestamp: string;
  blockHash: string;
  status: string;
  txns: number;
  chainId: TChainID;
  // miner: string;
  reward: {
    usdPrice: number;
    elfPrice: number;
  };
  previousBlockHash: string;
  blockSize: string;
  merkleTreeRootOfTransactions: string;
  merkleTreeRootOfWorldState: string;
  merkleTreeRootOfTransactionState: string;
  extra: string;
  producer: IProducer;
  burntFee: IBurntFee;
  transactions: ITransactionsResponseItem[];
  total: number;
}

export interface IInlines {
  from: IFromInfo;
  to: IFromInfo;
  methodName: string;
  //Transferrd
  symbol: string;
  amount: string;
}

export interface ITokensTransferrdItem {
  from: IFromInfo;
  to: IFromInfo;
  symbol: string;
  amount: number;
  nowPrice: string;
  tradePrice: string;
  imageUrl: string;
}

export type TTokensTransferrd = ITokensTransferrdItem[];

export interface INftsTransferredItem {
  from: IFromInfo;
  to: IFromInfo;
  amount: string;
  name: string;
  symbol: string;
  isCollection: boolean;
}

export type TNftsTransferred = INftsTransferredItem[];

export interface ITransactionValues {
  symbol: string;
  amount: number;
  priceInUsd: string;
}

export interface ITransactionDetailData {
  transactionId: string;
  status: StatusEnum;
  blockHeight: string;
  blockConfirmations: number;
  timestamp: number;
  method: string;
  from: IFromInfo;
  to: IFromInfo;
  tokenTransferreds: TTokensTransferrd;
  nftsTransferred: TNftsTransferred;
  transactionValues: ITransactionValues[];
  transactionFees: [];
  resourcesFee: string;
  burntFees: ITransactionValues[];
  transactionRefBlockNumber: string;
  transactionRefBlockPrefix: string;
  transactionParams: string;
  returnValue: string;
  transactionSignature: string;
  version: string;
  bloom: string;
  error: string;
  transactionSize: string;
  resourceFee: string;

  // TODO: Not necessarily needed here
  previousTransactionHash: string;
  nextTransactionHash: string;
  // blockHash: string;
  // txnValue: string;
  value: string;
  burntFee: string;
  // burntFeeInUsd: string;
  // TransactionRefBlockNumber: string;
  transactionFee: string;
  logs: ILogsProps[];
  total: number;
}
