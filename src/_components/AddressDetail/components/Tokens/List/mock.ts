import { TokensListItemType } from '@_types/commonDetail';
const data = Array.from(new Array(100).keys()).map((item) => {
  return {
    asset: 'ELF' + item,
    symbol: 'BEAN3CRV-fBEAN3CRV-fBEANBAG3CRV-fBEAN3CRV-fBEAN',
    quantity: '44444444444444444444444444',
    balance: '10.1',
    priceInUsd: 44444444,
    pricePercentChange24h: 22.2,
    totalPriceInUsd: 44444444.0,
  };
});
export default async function fetchData({ page, pageSize }): Promise<{
  total: number;
  list: TokensListItemType[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    list: data.slice((page - 1) * pageSize, page * pageSize),
  };
}
