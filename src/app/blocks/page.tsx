import { fetchServerBlocks } from '@_api/fetchBlocks';
import BlockList from './blockList';
export default async function BlocksPage() {
  const data = await fetchServerBlocks({
    chainId: 'AELF',
    maxResultCount: 25,
  });
  return <BlockList SSRData={data} />;
}
