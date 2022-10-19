interface Transaction {
  From: string;
  To: string;
  RefBlockNumber: number;
  RefBlockPrefix: string;
  MethodName: string;
  Params: string;
  Signature: string;
}
export interface IInfo {
  TransactionId: string;
  Status: 'MINED' | 'FAILED' | 'PENDING';
  Logs: any[];
  Bloom: string;
  BlockNumber: number;
  BlockHash: string;
  Transaction: Transaction;
  ReturnValue: string;
  Error?: any;
  TransactionSize: number;
  fee: any;
  resources: any;
  time: string;
}
