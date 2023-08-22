/*
 * @author: Peterbjx
 * @Date: 2023-08-17 17:41:57
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 21:28:47
 * @Description: ts
 */
export type DetailData = {
  blockHeight: number;
  timestamp: string;
  blockHash: string;
  status: string;
  txns: number;
  chainId: string;
  miner: string;
  reward: string;
  previousBlockHash: string;
  blockSize: number;
  merkleTreeRootOfTransactions: string;
  merkleTreeRootOfWorldState: string;
  merkleTreeRootOfTransactionState: string;
  extra: string;
  producer: {
    name: string;
    chainId: string;
  };
  burntFee: string;
  transactions: [
    {
      transactionHash: string;
      status: string;
      method: string;
      blockHeight: number;
      timestamp: number;
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
    },
  ];
  total: number;
};
