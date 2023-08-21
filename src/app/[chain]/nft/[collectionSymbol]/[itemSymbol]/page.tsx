/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:22:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:11:41
 * @Description: collection item
 */
import { notFound } from 'next/navigation';
import request from '@_api';
import NFTDetails from './NFTDetails';
export default async function NFTDetailsPage({ params }: { params: ChainId & CollectionSymbol & ItemSymbol }) {
  if (!params.collectionSymbol) {
    return notFound();
  }
  const { products } = await request.block.query({ params: { q: params.collectionSymbol } });
  if (!products) {
    return notFound();
  }

  return <NFTDetails />;
}
