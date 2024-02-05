import { ITransferItem, ITransferTableData } from '../../type';

const tokensList: ITransferItem[] = Array.from(new Array(100).keys()).map((key) => ({
  transactionHash: '0x9bce5d315ef82rf2' + `${key}`,
  status: '',
  method: 'Exec Transfer',
  blockHeight: '',
  timestamp: '12121211212',
  from: {
    name: '',
    address: '0x1cdewearvhhiwdfdf2d5A',
    addressType: 0,
    isManager: false,
    isProducer: true,
  },
  to: {
    name: '',
    address: 'AELF.Contract.Token',
    addressType: 0,
    isManager: false,
    isProducer: true,
  },
  quantity: 1212121,
}));

export default async function fetchData({ page, pageSize }): Promise<ITransferTableData> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    total: 10000,
    transfers: tokensList.slice((page - 1) * pageSize, page * pageSize),
  };
}
