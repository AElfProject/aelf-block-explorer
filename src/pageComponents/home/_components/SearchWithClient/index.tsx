'use client';
import { TSearchValidator } from '@_components/Search/type';
import Search from '@_components/Search';
import { useRouter } from 'next/navigation';

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

export default function SearchComp({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  function onSearchButtonClickHandler(queryTxt) {
    router.push(`/search/${queryTxt}`);
  }
  return (
    <Search
      searchIcon={false}
      searchButton={true}
      searchValidator={isMobile ? undefined : searchValidator}
      placeholder={'Search by Address / Txn Hash / Block'}
      isMobile={isMobile}
      onSearchButtonClickHandler={onSearchButtonClickHandler}
    />
  );
}
