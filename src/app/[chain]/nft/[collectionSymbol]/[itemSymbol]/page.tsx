/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:22:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:11:41
 * @Description: collection item
 */
import { notFound } from 'next/navigation';
// import request from '@_api';
import NFTDetails from './NFTDetails';
import { fetchData } from './_itemActivity/mock';
export default async function NFTDetailsPage({ params }: { params: ChainId & CollectionSymbol & ItemSymbol }) {
  if (!params.collectionSymbol) {
    return notFound();
  }
  const data = await fetchData({ page: 1, pageSize: 25 });
  if (!data) {
    return notFound();
  }

  return <NFTDetails SSRData={data} />;
}
