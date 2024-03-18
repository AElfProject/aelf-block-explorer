import { NftsItemType } from '@_types/commonDetail';
const data = Array.from(new Array(100).keys()).map((item) => {
  return {
    item: 'item' + item,
    collection: 'collection',
    quantity: '3',
    timestamp: '2023-08-15T08:42:41.1123602Z',
  };
});
export default async function fetchData({ page, pageSize }): Promise<{
  total: number;
  list: NftsItemType[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    list: data.slice((page - 1) * pageSize, page * pageSize),
  };
}
