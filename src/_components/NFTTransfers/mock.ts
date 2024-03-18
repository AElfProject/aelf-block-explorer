const data = Array.from(new Array(100).keys()).map((item) => {
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
    item: '{}',
  };
});
export default async function fetchData({ page, pageSize }): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    data: data.slice((page - 1) * pageSize, page * pageSize),
  };
}
