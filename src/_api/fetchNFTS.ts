import request from '@_api';
import { ICollectionDetailRequestParams, ICollectionTransfersRequestParams, TTokenListRequestParams } from './type';
import { INFTsTableData } from '@app/[chain]/nfts/type';
import { CollectionDetailData, CollectionTransfersData } from '@app/[chain]/nft/[collectionSymbol]/_Detail/type';

const defaultTokenListData = {
  total: 0,
  list: [],
};
export async function fetchNFTSList(params: TTokenListRequestParams): Promise<INFTsTableData> {
  const result = await request.nfts.getNFTSList({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}

export async function fetchServerNFTSList(params: TTokenListRequestParams): Promise<INFTsTableData> {
  const result = await request.nfts.getServerNFTSList({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}
export async function fetchServerCollectionDetail(
  params: ICollectionDetailRequestParams,
): Promise<CollectionDetailData> {
  const result = await request.nfts.getServerCollectionDetail({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}

export async function fetchNFTTransfers(params: ICollectionTransfersRequestParams): Promise<CollectionTransfersData> {
  const result = await request.nfts.getNFTTransfers({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}
