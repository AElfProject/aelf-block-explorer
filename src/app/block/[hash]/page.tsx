/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:01:05
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 10:34:43
 * @Description: Block
 */
import { fetchServerBlocksDetail } from '@_api/fetchBlocks';
import Detail from './_components/detail';
export default async function Block({ params }: { params: HashParams }) {
  const data = await fetchServerBlocksDetail({ blockHeight: Number(params.hash), chainId: 'AELF' });
  return <Detail SSRData={data} />;
}
