import request from '@_api';
import {
  ITransactionDetailRequestParams,
  ITransactionDetailDataList,
  TTransactionsListRequestParams,
  ITransactionsResponse,
} from './type';

export async function fetchTransactionDetails(
  params: ITransactionDetailRequestParams,
): Promise<ITransactionDetailDataList> {
  const result = await request.tx.getTransactionDetail({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchTransactionList(params: TTransactionsListRequestParams): Promise<ITransactionsResponse> {
  const result = await request.tx.getTransactionList({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchServerTransactionList(
  params: TTransactionsListRequestParams,
): Promise<ITransactionsResponse> {
  const result = await request.tx.getServerTransactionList({
    params: params,
  });
  const data = result?.data;
  return data;
}
