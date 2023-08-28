const blocks = Array.from(new Array(100).keys()).map((item) => {
  return {
    rank: item + 1,
    balance: '277482680.46581',
    txnCount: item + 32,
    address: '25CuX2FXDvhaj7etTpezDQDunk5xGhytxE68yTYJJfMkQwvj5p',
    percentage: '27.7483%',
  };
});
export default async function fetchData({ page, pageSize }): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    data: blocks.slice((page - 1) * pageSize, page * pageSize),
  };
}
