/*
 * @Author: abigail.deng
 * @Date: 2023-07-31 16:04:07
 * @LastEditors: abigail.deng
 * @LastEditTime: 2023-08-01 17:13:27
 * @Description: Tokens
 */
import TokensList from './tokensList';
import fetchData from './mock';

export default async function TokensPage({ params }: { params: ChainId }) {
  console.log('chainId', params);
  const data = await fetchData({ page: 1, pageSize: 50 });
  return <TokensList SSRData={data} />;
}
