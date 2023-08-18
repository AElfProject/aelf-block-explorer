/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:01:05
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 10:34:43
 * @Description: Block
 */
import Detail from './_components/detail';
import fetchData from './_components/mock';
export default async function Block({ params }: { params: HashParams }) {
  const data = await fetchData({ blockHeight: Number(params.hash) });
  return <Detail SSRData={data} />;
}
