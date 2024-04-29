/*
 * @Author: abigail.deng
 * @Date: 2023-07-31 16:04:07
 * @LastEditors: abigail.deng
 * @LastEditTime: 2023-08-01 17:13:27
 * @Description: Tokens
 */
import { ChainId } from 'global';
import TokensList from './tokensList';
import { fetchServerTokenList } from '@_api/fetchTokens';
import { TChainID } from '@_api/type';
import { SortEnum } from '@_types/common';

export default async function TokensPage({ params }: { params: ChainId }) {
  const data = await fetchServerTokenList({
    skipCount: 0,
    maxResultCount: 50,
    chainId: params.chain as TChainID,
    orderBy: 'HolderCount',
    sort: SortEnum.desc,
    cache: 'no-store',
  });
  return <TokensList SSRData={data} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
