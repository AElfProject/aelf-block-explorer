/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:13:52
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:13:09
 * @Description: TokenSysbol
 */
import { ChainId } from 'global';
import Detail from './detail';
import { fetchTokenDetail } from '@_api/fetchTokens';
import { TChainID } from '@_api/type';

export default async function TokenSymbol({
  params: { chain, tokenSymbol },
}: {
  params: ChainId & {
    tokenSymbol: string;
  };
}) {
  const tokenDetail = await fetchTokenDetail({ chainId: chain as TChainID, symbol: tokenSymbol, cache: 'no-store' });
  console.log(tokenDetail, 'tokenDetail');
  return (
    <div>
      <Detail tokenDetail={tokenDetail} />
    </div>
  );
}
