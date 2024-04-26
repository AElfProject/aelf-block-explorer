import { notFound } from 'next/navigation';
import Detail from './_components/detail';
import { fetchTransactionDetails } from '@_api/fetchTransactions';
export default async function TransactionDetails({
  params,
  searchParams,
}: {
  params: HashParams;
  searchParams: TSearchParamsForTransactionDetail;
}) {
  console.log('params', params);
  console.log('searchParams', searchParams);

  if (!params.hash) {
    return notFound();
  }
  if (!searchParams.chainId || !searchParams.blockHeight) {
    return notFound();
  }

  const paramsForTransactionDetails = {
    chainId: searchParams.chainId,
    transactionId: params.hash,
    blockHeight: searchParams.blockHeight,
  };
  // http://localhost:3000/tx/412a0b59572e9c4056b308e6d5b584d649ecb2415580f29f466f62a2c784f24b?chainId=tDVW&blockHeight=114844339
  const transactionDetailDataList = await fetchTransactionDetails(paramsForTransactionDetails);
  const transactionDetailData = transactionDetailDataList?.list?.[0];
  console.log(JSON.stringify(transactionDetailData));
  return <Detail SSRData={transactionDetailData} />;
}
