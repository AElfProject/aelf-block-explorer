/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:42:09
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 15:05:11
 * @Description: Contracts
 */
import ContractsList from './contractsList';
import fetchData from './mock';
export default async function BlocksPage() {
  const data = await fetchData({ page: 1, pageSize: 50 });
  return <ContractsList SSRData={data} />;
}
