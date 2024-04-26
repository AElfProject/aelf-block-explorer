/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:13:52
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:13:09
 * @Description: TokenSysbol
 */
import { ChainId } from 'global';
import Detail from './detail';
import { fetchHoldersData, fetchTokenDetailData, fetchTransfersData } from './mock';

export default async function TokenSymbol({
  params: { chain, tokenSymbol },
}: {
  params: ChainId & {
    tokenSymbol: string;
  };
}) {
  const [tokenDetail, transfersList, holdersList] = await Promise.all([
    fetchTokenDetailData({ chainId: chain, symbol: tokenSymbol }),
    fetchTransfersData({ page: 1, pageSize: 50 }),
    fetchHoldersData({ page: 1, pageSize: 50 }),
  ]);
  return (
    <div>
      <Detail tokenDetail={tokenDetail} transfersList={transfersList} holdersList={holdersList} />
    </div>
  );
}
