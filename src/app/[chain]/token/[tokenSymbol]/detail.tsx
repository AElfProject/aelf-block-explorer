'use client';
import EPTabs from '@_components/EPTabs';
import HeadTitle from '@_components/HeaderTitle';
import { FontWeightEnum, Typography } from 'aelf-design';
import { TabsProps } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Holders from './_components/Holders';
import OverView from './_components/Overview';
import Transfers from './_components/Transfers';
import './index.css';
import { fetchTransfersData } from './mock';
import { IHolderTableData, ITokenDetail, ITransferTableData, SearchType } from './type';
import { formatSearchValue, getSearchType } from './utils';

const { Title } = Typography;

interface IDetailProps {
  tokenDetail: ITokenDetail;
  transfersList: ITransferTableData;
  holdersList: IHolderTableData;
}

export default function Detail({ tokenDetail, transfersList, holdersList }: IDetailProps) {
  const [search, setSearch] = useState<string>('2K6gPkMBMfxatiZLYkUDPmp429BbKZCUCSpuysj4PCeiHo3V7v');
  const [searchType, setSearchType] = useState<SearchType>(SearchType.other);

  const onSearchInputChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const onSearchChange = useCallback(
    (val) => {
      console.log('search value', val);
      setSearch(val);
      const value = formatSearchValue(val);
      if (!value) {
        //Todo: refresh
      }
      setSearchType(getSearchType(value));
      fetchTransfersData({ page: 1, pageSize: 50, search });
    },
    [search],
  );

  const items: TabsProps['items'] = useMemo(() => {
    const transfersItem = {
      key: 'transfers',
      label: 'Transfers',
      children: (
        <Transfers
          search={search}
          searchType={searchType}
          SSRData={transfersList}
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
          SSRData={holdersList}
          onSearchChange={onSearchChange}
          onSearchInputChange={onSearchInputChange}
        />
      ),
    };

    if (searchType !== SearchType.other) {
      return [transfersItem];
    }

    return [transfersItem, holdersItem];
  }, [holdersList, onSearchChange, onSearchInputChange, search, searchType, transfersList]);

  useEffect(() => {
    const val = formatSearchValue(search);
    setSearchType(getSearchType(val));
  }, [search]);

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
