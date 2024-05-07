import { notFound } from 'next/navigation';
// import request from '@_api';
import CollectionDetails from './CollectionDetails';
import { ChainId, CollectionSymbol } from 'global';
import { fetchServerCollectionDetail } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';

export default async function NFTDetailsPage({
  params,
  search,
}: {
  params: ChainId & CollectionSymbol;
  search?: string;
}) {
  if (!params.collectionSymbol) {
    return notFound();
  }
  const { chain, collectionSymbol } = params;
  // init data from  server
  const overviewData = await fetchServerCollectionDetail({
    chainId: chain as TChainID,
    collectionSymbol,
    cache: 'no-store',
  });
  return <CollectionDetails overview={overviewData} search={search} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
