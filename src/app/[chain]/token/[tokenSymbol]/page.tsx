import fetchData from '@pageComponents/token/mock';
import TokenItem from '@pageComponents/token/page';
export default async function TokenSysbol({ params }: { params: ChainId & TokenSymbol }) {
  const data = await fetchData({ page: 1, pageSize: 25 });
  return <TokenItem SSRData={data}></TokenItem>;
}
