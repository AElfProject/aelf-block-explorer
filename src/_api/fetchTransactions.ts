import request from '@_api';
import { ITransactionDetailRequestParams, ITransactionDetailDataList } from './type';

export async function fetchTransactionDetails(
  params: ITransactionDetailRequestParams,
): Promise<ITransactionDetailDataList> {
  const result = await request.tx.getTransactionDetail({
    params: params,
  });
  const data = result?.data;
  return data;
}
