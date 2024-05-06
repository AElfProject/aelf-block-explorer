import request from '@_api';
import { TTokenListRequestParams } from './type';
import { INFTsTableData } from '@app/[chain]/nfts/type';

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
