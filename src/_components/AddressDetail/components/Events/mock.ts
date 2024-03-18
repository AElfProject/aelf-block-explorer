import { IEvents } from './type';
const data = Array.from(new Array(25).keys()).map((item) => {
  return {
    logs: {
      address: '0a3b5e972db484b758109ef2f0d50bfadd88ac92862592427a034bf066c22275',
      name: 'MiningInformationUpdated',
      indexed: [],
      nonIndexed: '',
      decode: JSON.stringify({
        pubkey:
          '0458ad2ec4d8944bff7f3ab7b56a90ffca784b0632bdf8c4a952da153b24b3fbbda5432f5ef293ab7ced791969f5fe02b0b5e6bc5af7ce074a9dc386c8dab0e6db',
        miningTime: {
          seconds: '1692602564',
          nanos: 407321800,
        },
        behaviour: 'UpdateTinyBlockInformation',
        blockHeight: '166146838',
        previousBlockHash: '3b5564ae3f6e60695326cf06bbe08d52b4810222f9aa9907c874bedcfb66cd2f',
      }), //decode json
    },
    id: item,
    timestamp: '2023/07/26 12:03:48+00:00',
    txnHash: 'cc764efe0d5b8f9a73fffa3aecc7e3a26d715a715a764af464dd80dd7f2ca03e',
    address: 'YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy',
    method: 'DonateResourceToken',
    blockHeight: 121342 + item,
  };
});
export default async function fetchData({ page, pageSize }): Promise<{
  total: number;
  list: IEvents[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    list: data.slice((page - 1) * pageSize, page * pageSize),
  };
}
