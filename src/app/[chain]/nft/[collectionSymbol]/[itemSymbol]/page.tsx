/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:22:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:11:41
 * @Description: collection item
 */
import { notFound } from 'next/navigation';
import './index.css';
// import request from '@_api';
import NFTDetails from './NFTDetails';
import { fetchActiveData, fetchHolderData, fetchOverviewData } from './mock';
export default async function NFTDetailsPage({ params }: { params: ChainId & CollectionSymbol & ItemSymbol }) {
  if (!params.collectionSymbol) {
    return notFound();
  }
  const [activity, holder, overview] = await Promise.all([
    fetchActiveData({ page: 1, pageSize: 10 }),
    fetchHolderData({ page: 1, pageSize: 10 }),
    fetchOverviewData(),
  ]);

  return <NFTDetails activity={activity} holder={holder} overview={overview} />;
}
