import Detail from '@_components/AddressDetail';
import { TitleEnum } from '@_types/commonDetail';
import fetchData from './mock';
import { HashParams } from 'global';
export default async function AddressDetails({ params }: { params: HashParams }) {
  const data = await fetchData();
  return (
    <Detail SSRData={data} title={data.contractName ? TitleEnum.Contract : TitleEnum.Address} hash={params.hash} />
  );
}
