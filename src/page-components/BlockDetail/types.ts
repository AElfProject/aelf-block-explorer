import { NextRouter } from 'next/router';
export interface IRes {
  miner?: string;
  dividends?: string;
}
export interface Itx {
  id: number;
  tx_id: string;
  params_to: string;
  chain_id: string;
  block_height: number;
  address_from: string;
  address_to: string;
  params: string;
  method: string;
  block_hash: string;
  tx_fee: string;
  resources: string;
  quantity: number;
  tx_status: string;
  time: string;
  contractName: string;
  transactions?: number;
}
interface IBasicInfo {
  blockHeight: string;
  timestamp: string;
  blockHash: string;
  transactions: number;
  chainId: string;
  miner?: string;
  reward?: string;
  previousBlockHash: string;
}
interface IExtensionInfo {
  blockSize: number;
  merkleTreeRootOfTransactions: string;
  merkleTreeRootOfWorldState: string;
  merkleTreeRootOfTransactionState: string;
  extra: string;
  bloom: string;
  signerPubkey: string;
}
export interface IBlockInfo {
  basicInfo: IBasicInfo;
  extensionInfo: IExtensionInfo;
}
export interface ITransactions {
  transactions?: Itx[];
}
export interface IProps {
  pageidssr?: string | string[] | number;
  activekeyssr: string;
  bestchainheightssr: string;
  blockheightssr: string;
  txslistssr?: Itx[];
  blockinfossr?: IBlockInfo;
  headers: any;
  router: NextRouter;
  pricessr: object;
}
