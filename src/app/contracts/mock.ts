const data = Array.from(new Array(100).keys()).map((item) => {
  return {
    address: item + 'KNdM6U6PyPsgyena8rPHTbCoMrkrALhxAy1b8Qx2cgi4169xr',
    contractName: 'AElf.ContractNames.Treasury',
    type: 'System',
    version: '1.5.0.0',
    balance: '1,000,000,000.00112726 ELF',
    txns: 2449 + item,
    lastUpdateTime: '2023/07/26 11:54:52+00:00',
  };
});
export default async function fetchData({ page, pageSize }): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    data: data.slice((page - 1) * pageSize, page * pageSize),
  };
}
