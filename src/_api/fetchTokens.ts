import request from '@_api';
import {
  ITokenHoldersRequestParams,
  ITokenTransfersRequestParams,
  ITokenDetailRequestParams,
  TTokenListRequestParams,
} from './type';
import { IHolderTableData, ITokenDetail, ITokenList, ITransferTableData } from '@app/[chain]/token/[tokenSymbol]/type';

export async function fetchTokenList(params: TTokenListRequestParams): Promise<ITokenList> {
  const result = await request.tx.getTransactionDetail({
    params: params,
  });
  const data = result?.data;
  return data;
}
export async function fetchServerTokenList(params: TTokenListRequestParams): Promise<ITokenList> {
  const result = await request.tx.getTransactionDetail({
    params: params,
  });
  const data = result?.data;
  return data;
}
export async function fetchTokenDetail(params: ITokenDetailRequestParams): Promise<ITokenDetail> {
  const result = await request.tx.getTransactionDetail({
    params: params,
  });
  const data = result?.data;
  return data;
}
export async function fetchTokenDetailTransfers(params: ITokenTransfersRequestParams): Promise<ITransferTableData> {
  const result = await request.tx.getTransactionDetail({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchTokenDetailHolders(params: ITokenHoldersRequestParams): Promise<IHolderTableData> {
  const result = await request.tx.getTransactionDetail({
    params: params,
  });
  const data = result?.data;
  return data;
}
