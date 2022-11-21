interface ITx {
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
  tx_status: 'MINED' | 'FAILED' | 'PENDING';
  time: string;
  contractName?: string;
}
export interface ITxs {
  transactions?: ITx[];
  total?: number;
}
interface IContractName {
  isSystemContract: boolean;
  address: string;
  contractName: string;
}
export interface IAllContractName {
  list?: IContractName[];
  total?: number;
}
export interface IProps {
  actualtotalssr: number;
  datasourcessr: ITx[];
  headers: any;
}
