'use client';
import EPTabs from '@_components/EPTabs';
import HeadTitle from '@_components/HeaderTitle';
import { FontWeightEnum, Typography } from 'aelf-design';
import { TabsProps } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import Holders from './_components/Holders';
import OverView from './_components/Overview';
import Transfers from './_components/Transfers';
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
  const [searchType, setSearchType] = useState<SearchType>(SearchType.address);

  const items: TabsProps['items'] = useMemo(() => {
    const transfersItem = {
      key: 'transfers',
      label: 'Transfers',
      children: <Transfers search={search} searchType={searchType} SSRData={transfersList} />,
    };

    const holdersItem = {
      key: 'holders',
      label: 'Holders',
      children: <Holders SSRData={holdersList} />,
    };

    if (searchType !== SearchType.other) {
      return [transfersItem];
    }

    return [transfersItem, holdersItem];
  }, [holdersList, search, searchType, transfersList]);

  const onSearch = useCallback(
    (e) => {
      setSearch(e.target.value);
      const value = formatSearchValue(e.target.value);
      if (!value) {
        // refresh
      }
      setSearchType(getSearchType(value));
      fetchTransfersData({ page: 1, pageSize: 50, search });
    },
    [search],
  );

  return (
    <>
      <HeadTitle content={`Token ${tokenDetail.token.name || '--'}`}>
        <Title
          level={6}
          fontWeight={FontWeightEnum.Bold}
          className="ml-1 !text-[#858585]">{`(${tokenDetail.token.symbol || '--'})`}</Title>
      </HeadTitle>
      <OverView data={tokenDetail} />
      <EPTabs items={items} selectKey="transfers" />
    </>
  );
}
