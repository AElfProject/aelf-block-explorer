const blocks = Array.from(new Array(100).keys()).map((item) => {
  return {
    blockHeight: 165018684 + item,
    timestamp: '2023-08-14T08:20:16.3833194Z',
    transactionCount: item,
    timeSpan: '8.0',
    producerName: 'AELF',
    producerAddress: '29JHMRj99HfhiNUfXFu6jbfujTnZS4KC8NGx3zJeHCKbjbQDP4',
    reward: '0.00112726 ELF',
    burntFee: '1,550.00011273 ELF',
  };
});
export default async function fetchData({ page, pageSize }): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    total: 100,
    blocks: blocks.slice((page - 1) * pageSize, page * pageSize),
  };
}
