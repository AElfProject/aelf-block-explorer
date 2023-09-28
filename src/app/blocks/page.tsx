import BlockList from './blockList';
import fetchData from './mock';
export default async function BlocksPage() {
  const data = await fetchData({ page: 1, pageSize: 25 });
  return <BlockList SSRData={data} />;
}
