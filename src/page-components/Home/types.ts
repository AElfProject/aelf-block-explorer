export interface BasicInfo {
  height: number;
  totalTxs: number;
  unconfirmedBlockHeight: string;
  accountNumber: number;
}
export interface BlockItem {
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
export interface BlocksResult {
  blocks: BlockItem[];
  total: number;
}
export interface TXItem {
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
export interface TXSResultDto {
  transactions: TXItem[];
  total: number;
}
interface FormatBlockBodyDto {
  TransactionsCount: number;
  Transactions: string[];
}
interface FormatBlockHeaderDto {
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
interface DividendDto {
  ELF: number;
}
export interface FormatBlockDto {
  BlockHash: string;
  BlockSize: number;
  Body: FormatBlockBodyDto;
  Header: FormatBlockHeaderDto;
  dividend: DividendDto;
  miner: string;
}
interface SocketTransactionItem {
  From: string;
  MethodName: string;
  Params: string;
  RefBlockNumber: number;
  RefBlockPrefix: string;
  Signature: string;
  To: string;
}
export interface SocketTxItem {
  BlockHash: string;
  BlockNumber: number;
  Bloom: string;
  Error: any;
  Logs: string[];
  ReturnValue: string;
  Status: string;
  Transaction: SocketTransactionItem;
  TransactionId: string;
  TransactionSize: number;
  fee: object;
  time: string;
}

export interface SocketBlocksList {
  block: FormatBlockDto;
  txs: SocketTxItem[];
}

export interface SocketData {
  accountNumber: number;
  allChainAccount: number;
  allChainTxs: number;
  dividends: DividendDto;
  height: number;
  list: SocketBlocksList[];
  totalTxs: number;
  unconfirmedBlockHeight: string;
}

export interface PriceDto {
  USD: number;
  [key: string]: string | number;
}

export interface PreviousPriceDto {
  usd: number;
  [key: string]: string | number;
}
export interface TpsDataDto {
  own: any;
  all: any;
}
export interface RewardDto {
  ELF: number;
  [key: string]: string | number;
}
export interface HomeProps {
  mobileprice: PriceDto;
  mobileprevprice: PreviousPriceDto;
  tpsdata: TpsDataDto;
  blockheight: number;
  rewardssr: RewardDto;
  localaccountsssr: number;
  unconfirmedblockheightssr: number;
  localtransactionsssr: number;
  transactionsssr: TXItem[];
  blocksssr: BlockItem[];
  headers: any;
}
