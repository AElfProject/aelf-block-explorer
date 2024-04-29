import { fetchServerBlocks } from '@_api/fetchBlocks';
import BlockList from './blockList';

export default async function BlocksPage({ params }) {
  const data = await fetchServerBlocks({
    chainId: params.chain || 'AELF',
    maxResultCount: 25,
    skipCount: 0,
    cache: 'no-store',
  });
  return <BlockList SSRData={data} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
