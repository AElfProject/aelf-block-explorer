/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:16:23
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:12:23
 * @Description: NFTs
 */

import { fetchServerNFTSList } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
import { SortEnum } from '@_types/common';
import { ChainId } from 'global';
import List from './list';
export default async function Nfts({ params }: { params: ChainId }) {
  const data = await fetchServerNFTSList({
    skipCount: 0,
    maxResultCount: 50,
    chainId: params.chain as TChainID,
    orderBy: 'HolderCount',
    sort: SortEnum.desc,
    cache: 'no-store',
  });
  return <List SSRData={data} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
