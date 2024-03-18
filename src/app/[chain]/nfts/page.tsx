/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:16:23
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:12:23
 * @Description: NFTs
 */

import List from './list';
import fetchData from './mock';
export default async function Nfts({ params }: { params: ChainId }) {
  console.log('chainId:', params);
  const data = await fetchData({ page: 1, pageSize: 50 });
  return <List SSRData={data} />;
}
