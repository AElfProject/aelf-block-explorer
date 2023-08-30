import Detail from './_components/detail';
import fetchData from './mock';
export default async function TransactionDetails({ params }: { params: HashParams }) {
  const data = await fetchData({ transactionHash: params.hash });
  return <Detail SSRData={data} />;
}
