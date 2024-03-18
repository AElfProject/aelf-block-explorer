import { notFound } from 'next/navigation';
// import request from '@_api';
import { PAGE_SIZE } from './type';
import CollectionDetails from './CollectionDetails';
import { fetchOverviewData, fetchTransferList } from './mock';

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
  // init data from  server
  const [overviewData, transferList] = await Promise.all([
    fetchOverviewData(),
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
