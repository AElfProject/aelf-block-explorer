import request from '@_api';
import {
  ITokenHoldersRequestParams,
  ITokenTransfersRequestParams,
  ITokenDetailRequestParams,
  TTokenListRequestParams,
} from './type';
import { IHolderTableData, ITokenDetail, ITokenList, ITransferTableData } from '@app/[chain]/token/[tokenSymbol]/type';
const defaultTokenListData: ITokenList = {
  total: 0,
  list: [],
};
export async function fetchTokenList(params: TTokenListRequestParams): Promise<ITokenList> {
  const result = await request.token.getTokenList({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}
export async function fetchServerTokenList(params: TTokenListRequestParams): Promise<ITokenList> {
  const result = await request.token.getServerTokenList({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}
export async function fetchTokenDetail(params: ITokenDetailRequestParams): Promise<ITokenDetail> {
  const result = await request.token.getTokenDetail({
    params: params,
  });
  const data = result?.data;
  return data;
}
export async function fetchTokenDetailTransfers(params: ITokenTransfersRequestParams): Promise<ITransferTableData> {
  const result = await request.token.getTokenDetailTransfers({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}

export async function fetchTokenDetailHolders(params: ITokenHoldersRequestParams): Promise<IHolderTableData> {
  const result = await request.token.getTokenDetailHolders({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}
