import { IAddressResponse } from '@_types/commonDetail';
export default async function fetchData(): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res: IAddressResponse = {
    symbol: 'ELF',
    tokenBalance: '277482680.465810000000',
    tokenPriceInUsd: 0.3016,
    tokenTotalPriceInUsd: 29.28450096,
    tokenHoldings: 11,
    contractName: Math.round(Math.random()) ? 'EBridge.Contracts.Bridge' : '',
    author: 'YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy', // address
    lastTxnSend: '0x27c6d185fafbcdasfsdfsdsafdsfs12212s1', // ca
    firstTxnSend: '0x27c6d185fafbcdasfsdfsdsafdsfs12212s1', // ca
    tokens: {
      assetInUsd: 2.2,
      assetPercentChange24h: 2.2,
      assetInElf: 2.2,
      total: 100,
      list: [
        {
          asset: 'asset',
          symbol: 'ELF',
          quantity: 'quantity',
          balance: '10.1',
          priceInUsd: 22.2,
          pricePercentChange24h: 22.2,
          totalPriceInUsd: 22.2,
        },
      ],
    },
    nfts: {
      total: 2.2,
      list: [
        {
          item: 'item',
          collection: 'collection',
          quantity: 'quantity',
          timestamp: '2023-08-15T08:42:41.1123602Z',
        },
      ],
    },
    transactions: {
      total: 100,
      list: Array.from(new Array(25).keys()).map((item) => {
        return {
          status: 'Fail',
          transactionHash: item + 'cc764efe0d5b8f9a73fffa3aecc7e3a26d715a715a764af464dd80dd7f2ca03e',
          blockHeight: '165018684',
          method: 'DonateResourceToken',
          timestamp: '2023-08-15T08:42:41.1123602Z',
          from: JSON.stringify({
            name: 'AELF',
            address: 'YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy',
          }),
          to: JSON.stringify({
            name: 'AELF',
            address: 'AELF.Contract.Token',
          }),
          txnValue: 0,
          txnFee: 0,
        };
      }),
    },
    tokenTransfers: {
      total: 100,
      list: Array.from(new Array(25).keys()).map((item) => {
        return {
          transactionHash: item + 'cc764efe0d5b8f9a73fffa3aecc7e3a26d715a715a764af464dd80dd7f2ca03e',
          status: 'Fail',
          method: 'DonateResourceToken',
          timestamp: '2022-08-11T06:02:20.1855375Z',
          from: JSON.stringify({
            name: 'AELF',
            address: 'YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy',
          }),
          to: JSON.stringify({
            name: 'AELF',
            address: 'AELF.Contract.Token',
          }),
          transferStatus: item % 2 === 0 ? 'in' : 'out', //in/out
          amount: '444444444',
          token: 'ELF',
        };
      }),
    },
    nftTransfers: {
      total: 100,
      list: Array.from(new Array(100).keys()).map((item) => {
        return {
          transactionHash: item + 'cc764efe0d5b8f9a73fffa3aecc7e3a26d715a715a764af464dd80dd7f2ca03e',
          status: 'Fail',
          method: 'DonateResourceToken',
          timestamp: '2022-08-11T06:02:20.1855375Z',
          from: JSON.stringify({
            name: 'AELF',
            address: 'YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy',
          }),
          to: JSON.stringify({
            name: 'AELF',
            address: 'YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy',
          }),
          transferStatus: item % 2 === 0 ? 'in' : 'out', //in/out
          amount: '444444444',
          item: '{}',
        };
      }),
    },
  };
  return res;
}
