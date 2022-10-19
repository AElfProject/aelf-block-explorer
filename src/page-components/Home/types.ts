export interface IBasicInfo {
  height: number;
  totalTxs: number;
  unconfirmedBlockHeight: string;
  accountNumber: number;
}
export interface IBlockItem {
  block_hash: string;
  block_height: number;
  chain_id: string;
  dividends: string;
  id: number;
  merkle_root_state: string;
  merkle_root_tx: string;
  miner: string;
  pre_block_hash: string;
  resources: string;
  time: string;
  tx_count: number;
  tx_fee: string;
}
export interface IBlocksResult {
  blocks: IBlockItem[];
  total: number;
}
export interface ITXItem {
  address_from: string;
  address_to: string;
  block_hash: string;
  block_height: number;
  chain_id: string;
  id: number;
  method: string;
  params: string;
  params_to: string;
  quantity: 0;
  resources: string;
  time: string;
  tx_fee: string;
  tx_id: string;
  tx_status: string;
}
export interface ITXSResultDto {
  transactions: ITXItem[];
  total: number;
}
interface IFormatBlockBodyDto {
  TransactionsCount: number;
  Transactions: string[];
}
interface IFormatBlockHeaderDto {
  PreviousBlockHash: string;
  MerkleTreeRootOfTransactions: string;
  Bloom: string;
  ChainId: string;
  Extra: string;
  Height: number;
  MerkleTreeRootOfTransactionState: string;
  MerkleTreeRootOfWorldState: string;
  SignerPubkey: string;
  Time: string;
}
interface IDividendDto {
  ELF: number;
}
export interface IFormatBlockDto {
  BlockHash: string;
  BlockSize: number;
  Body: IFormatBlockBodyDto;
  Header: IFormatBlockHeaderDto;
  dividend: IDividendDto;
  miner: string;
}
interface ISocketTransactionItem {
  From: string;
  MethodName: string;
  Params: string;
  RefBlockNumber: number;
  RefBlockPrefix: string;
  Signature: string;
  To: string;
}
export interface ISocketTxItem {
  BlockHash: string;
  BlockNumber: number;
  Bloom: string;
  Error: any;
  Logs: string[];
  ReturnValue: string;
  Status: string;
  Transaction: ISocketTransactionItem;
  TransactionId: string;
  TransactionSize: number;
  fee: object;
  time: string;
}

export interface ISocketBlocksList {
  block: IFormatBlockDto;
  txs: ISocketTxItem[];
}

export interface ISocketData {
  accountNumber: number;
  allChainAccount: number;
  allChainTxs: number;
  dividends: IDividendDto;
  height: number;
  list: ISocketBlocksList[];
  totalTxs: number;
  unconfirmedBlockHeight: string;
}

export interface IPriceDto {
  USD: number;
  [key: string]: string | number;
}

export interface IPreviousPriceDto {
  usd: number;
  [key: string]: string | number;
}
export interface ITpsDataDto {
  own: any;
  all: any;
}
export interface IRewardDto {
  ELF: number;
  [key: string]: string | number;
}
export interface IHomeProps {
  mobileprice: IPriceDto;
  mobileprevprice: IPreviousPriceDto;
  tpsdata: ITpsDataDto;
  blockheight: number;
  rewardssr: IRewardDto;
  localaccountsssr: number;
  unconfirmedblockheightssr: number;
  localtransactionsssr: number;
  transactionsssr: ITXItem[];
  blocksssr: IBlockItem[];
  headers: any;
}
