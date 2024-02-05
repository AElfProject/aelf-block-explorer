import { TTransactionStatus } from '@_types/common';
import { IHolderItem, IHolderTableData, ITokenDetail, ITransferItem, ITransferTableData } from './type';

const transfersList: ITransferItem[] = Array.from(new Array(100).keys()).map((key) => ({
  transactionHash: '0x9bce5d315ef82rf2u57ue7' + `${key}`,
  status: key % 2 === 0 ? TTransactionStatus.Success : TTransactionStatus.fail,
  method: 'Exec Transfer',
  blockHeight: '',
  timestamp: '12121211212',
  from: JSON.stringify({
    name: '',
    address: '0x1cdewearvhhiwdfdf2d5A',
    addressType: 0,
    isManager: false,
    isProducer: true,
  }),
  to: JSON.stringify({
    name: '',
    address: 'AELF.Contract.Token',
    addressType: 0,
    isManager: false,
    isProducer: true,
  }),
  quantity: 1212121,
}));

export async function fetchTransfersData({ page, pageSize }): Promise<ITransferTableData> {
  console.log('fetchTransfersData');
  await new Promise((resolve) => setTimeout(resolve, 200));
  const transfers = transfersList.slice((page - 1) * pageSize, page * pageSize);
  return {
    total: 10000,
    list: transfers,
  };
}

const holdersList: IHolderItem[] = Array.from(new Array(100).keys()).map((key) => ({
  address: JSON.stringify({
    name: '',
    address: '0x1cdewearvhhiwdfdf2d5A' + `${key}`,
    addressType: 0,
    isManager: false,
    isProducer: true,
  }),
  quantity: '1212121',
  percentage: '32',
  value: '7896',
}));

export async function fetchHoldersData({ page, pageSize }): Promise<IHolderTableData> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const holders = holdersList.slice((page - 1) * pageSize, page * pageSize);
  return {
    total: 10000,
    list: holders,
  };
}

export async function fetchTokenDetailData({ page, pageSize }): Promise<ITokenDetail> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    token: {
      name: 'ELF',
      symbol: 'ELF',
      imageUrl: '',
    },
    totalSupply: '1000000000',
    holders: 10000,
    holderPercentChange24h: 0.00913,
    totalTransfers: '123456',
    priceInUsd: 0.17,
    pricePercentChange24h: 12.1,
    contractAddress: 'ELF_rAWnCCYQgZAwMopFje6iAYEZkpbnF1zEDYs7U7WZihWZQpEQM_AELF',
    decimals: 8,
    transfers: {
      total: 20000,
      list: transfersList.slice(0, 50),
    },
    holdersList: {
      total: 2000,
      list: holdersList.slice(0, 50),
    },
  };
}
