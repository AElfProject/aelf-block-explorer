'use client';
import { TSearchValidator } from '@_components/Search/type';
import Search from '@_components/Search';
const searchValidator: TSearchValidator = [
  {
    label: 'All Filters',
    key: 0,
    limitNumber: 1,
  },
  {
    label: 'token',
    key: 1,
    limitNumber: 1,
  },
  {
    label: 'account',
    key: 2,
    limitNumber: 9,
  },
  {
    label: 'contract',
    key: 3,
    limitNumber: 2,
  },
];

export default function SearchComp() {
  return (
    <Search
      searchIcon={false}
      searchButton={true}
      deleteIcon={true}
      searchValidator={searchValidator}
      // searchWrapClassNames={'px-3 py-[9px] border-D0 bg-F7 w-[511px]'}
      // searchInputClassNames={'!pl-0 placeholder:!text-base-200'}
      placeholder={'Search by Address / Txn Hash / Block'}
    />
  );
}
