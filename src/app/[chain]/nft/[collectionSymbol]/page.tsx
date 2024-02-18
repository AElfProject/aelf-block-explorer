import CollectionDetail from './_Detail/index';
import { URL_QUERY_KEY } from './_Detail/type';

export default function Collection({
  params,
  searchParams,
}: {
  params: ChainId & CollectionSymbol;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = (searchParams[URL_QUERY_KEY] ?? '').toString();
  return (
    <div>
      <CollectionDetail params={params} search={search} />
    </div>
  );
}
