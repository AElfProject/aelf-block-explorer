'use client';
import EPTabs from '@_components/EPTabs';
import HeadTitle from '@_components/HeaderTitle';
import { FontWeightEnum, Typography } from 'aelf-design';
import { TabsProps } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import Holders from './_components/Holders';
import OverView from './_components/Overview';
import Transfers, { ITransfersRef } from './_components/Transfers';
import './index.css';
import { IHolderTableData, ITokenDetail, ITransferTableData, SearchType } from './type';
import { formatSearchValue, getSearchType } from './utils';

const { Title } = Typography;

interface IDetailProps {
  tokenDetail: ITokenDetail;
  // transfersList: ITransferTableData;
  // holdersList: IHolderTableData;
}

export default function Detail({ tokenDetail }: IDetailProps) {
  const [search, setSearch] = useState<string>('2K6gPkMBMfxatiZLYkUDPmp429BbKZCUCSpuysj4PCeiHo3V7v');
  const [searchType, setSearchType] = useState<SearchType>(SearchType.other);
  const transfersRef = useRef<ITransfersRef>(null);

  const onSearchInputChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const onSearchChange = useCallback((val) => {
    console.log('search value', val);
    const value = formatSearchValue(val);
    const searchType = getSearchType(value);
    if (searchType === SearchType.other) {
      console.log('refresh');
      // router.refresh();
      window.location.reload();
      return;
    }
    transfersRef?.current?.setSearchStr(val);
    setSearchType(searchType);
    // fetchTransfersData({ page: 1, pageSize: 50, searchText: val });
  }, []);

  const items: TabsProps['items'] = useMemo(() => {
    const transfersItem = {
      key: 'transfers',
      label: 'Transfers',
      children: (
        <Transfers
          ref={transfersRef}
          search={search}
          searchType={searchType}
          // SSRData={transfersList}
          onSearchChange={onSearchChange}
          onSearchInputChange={onSearchInputChange}
        />
      ),
    };

    const holdersItem = {
      key: 'holders',
      label: 'Holders',
      children: (
        <Holders
          searchType={searchType}
          search={search}
          // SSRData={holdersList}
          onSearchChange={onSearchChange}
          onSearchInputChange={onSearchInputChange}
        />
      ),
    };

    if (searchType !== SearchType.other) {
      return [transfersItem];
    }

    return [transfersItem, holdersItem];
  }, [onSearchChange, onSearchInputChange, search, searchType]);

  return (
    <div className="token-detail">
      <HeadTitle content={`Token ${tokenDetail.token.name || '--'}`}>
        <Title
          level={6}
          fontWeight={FontWeightEnum.Bold}
          className="ml-1 !text-[#858585]">{`(${tokenDetail.token.symbol || '--'})`}</Title>
      </HeadTitle>
      <OverView data={tokenDetail} />
      <EPTabs items={items} selectKey="transfers" />
    </div>
  );
}
