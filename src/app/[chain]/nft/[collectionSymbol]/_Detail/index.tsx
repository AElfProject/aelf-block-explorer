import { notFound } from 'next/navigation';
// import request from '@_api';
import { PAGE_SIZE } from './type';
import CollectionDetails from './CollectionDetails';
import { fetchOverviewData, fetchTransferList } from './mock';
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
  const [overviewData, transferList] = await Promise.all([
    fetchServerCollectionDetail({
      chainId: chain as TChainID,
      collectionSymbol,
      cache: 'no-store',
    }),
    fetchTransferList({
      skipCount: 0,
      maxResultCount: PAGE_SIZE,
      chainId: params.chain,
      symbol: params.collectionSymbol,
      search: search,
    }),
  ]);
  return <CollectionDetails overview={overviewData} transferList={transferList} search={search} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
