/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:01:05
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 10:34:43
 * @Description: Block
 */
import { fetchServerBlocksDetail } from '@_api/fetchBlocks';
import Detail from './_components/detail';
import { TChainID } from '@_api/type';
export default async function Block({ params }: { params: { hash: string; chain: TChainID } }) {
  const data = await fetchServerBlocksDetail({
    blockHeight: Number(params.hash),
    chainId: params.chain,
    cache: 'no-store',
  });
  console.log(data, 'data');
  return <Detail SSRData={data} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
