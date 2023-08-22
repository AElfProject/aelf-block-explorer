export interface ITableDataType {
  transactionHash: string;
  status: string;
  method: string;
  timestamp: string;
  blockHeight: number;
  from: {
    name: string;
    address: string;
  };
  to: {
    name: string;
    address: string;
  };
  txnValue: number;
  txnFee: number;
}
