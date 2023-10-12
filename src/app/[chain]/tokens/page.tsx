import fetchData from '@pageComponents/tokens/mock';
import TokenList from '@pageComponents/tokens/page';

export default async function Tokens({ params }: { params: ChainId }) {
  const data = await fetchData({ page: 1, pageSize: 25 });
  return <TokenList SSRData={data}></TokenList>;
}
