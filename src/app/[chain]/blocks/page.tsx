import { fetchServerBlocks } from '@_api/fetchBlocks';
import BlockList from './blockList';
export default async function BlocksPage({ params }) {
  const data = await fetchServerBlocks({
    chainId: params.chain || 'AELF',
    maxResultCount: 25,
  });
  return <BlockList SSRData={data} />;
}
