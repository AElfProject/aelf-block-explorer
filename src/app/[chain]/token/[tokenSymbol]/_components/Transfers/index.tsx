'use client';
import Table from '@_components/Table';
import { Descriptions, DescriptionsProps } from 'antd';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { ITokenSearchProps, ITransferItem, SearchType, TTransferSearchData } from '../../type';
import getColumns from './columns';

import { getSearchByHashItems, getSearchByHolderItems } from './utils';

import { useMobileAll } from '@_hooks/useResponsive';
import { pageSizeOption } from '@_utils/contant';
import { TChainID } from '@_api/type';
import { useParams } from 'next/navigation';
import { getPageNumber } from '@_utils/formatter';
import { fetchTokenDetailTransfers } from '@_api/fetchTokens';

interface ITransfersProps extends ITokenSearchProps {}

const labelStyle: React.CSSProperties = {
  color: '#858585',
  fontSize: '10px',
  lineHeight: '18px',
};

const contentStyle: React.CSSProperties = {
  color: '#252525',
  fontSize: '14px',
  lineHeight: '22px',
};

export interface ITransfersRef {
  setSearchStr: (val: string) => void;
}

const Transfers = ({ search, searchText, searchType, onSearchChange, onSearchInputChange }: ITransfersProps, ref) => {
  const { isMobile } = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<ITransferItem[]>([]);
  const [timeFormat, setTimeFormat] = useState<string>('Date Time (UTC)');
  const [address, setAddress] = useState<string>('');
  const [searchData, setSearchData] = useState<TTransferSearchData>();

  const { chain, tokenSymbol } = useParams();
  const [, setSearchText] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        chainId: chain as TChainID,
        symbol: tokenSymbol as string,
        skipCount: getPageNumber(currentPage, pageSize),
        maxResultCount: pageSize,
        search: searchText || '',
      };
      const res = await fetchTokenDetailTransfers(params);
      const { balance, value, list, total } = res;
      setData(list);
      setSearchData({ balance, value });
      setTotal(total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [chain, tokenSymbol, currentPage, pageSize, searchText]);

  useImperativeHandle(
    ref,
    () => ({
      setSearchStr(val: string) {
        setAddress(val);
        setSearchText(val);
      },
    }),
    [setSearchText],
  );

  const pageChange = async (page: number) => {
    setCurrentPage(page);
  };
  const pageSizeChange = async (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo(
    () =>
      getColumns({
        timeFormat,
        handleTimeChange: () => setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age'),
        chain,
      }),
    [chain, timeFormat],
  );
  const title = useMemo(() => `A total of ${total} ${total <= 1 ? 'token' : 'tokens'} found`, [total]);

  const searchByHolder: DescriptionsProps['items'] = useMemo(
    () => getSearchByHolderItems(address, isMobile, searchData),
    [address, isMobile, searchData],
  );
  const searchByHash: DescriptionsProps['items'] = useMemo(
    () => getSearchByHashItems(address, isMobile, chain, data[0]?.blockHeight),
    [address, chain, data, isMobile],
  );
  console.log(searchType, 'searchType');
  return (
    <div>
      {searchType !== SearchType.other && (
        <div className="mx-4 border-b border-b-[#e6e6e6] pb-4">
          {searchType === SearchType.address && (
            <Descriptions
              contentStyle={contentStyle}
              labelStyle={labelStyle}
              colon={false}
              layout="vertical"
              column={4}
              items={searchByHolder}
            />
          )}
          {searchType === SearchType.txHash && (
            <Descriptions
              contentStyle={contentStyle}
              labelStyle={labelStyle}
              colon={false}
              layout="vertical"
              column={4}
              items={searchByHash}
            />
          )}
        </div>
      )}
      <Table
        headerTitle={{
          single: {
            title,
          },
        }}
        topSearchProps={{
          value: search || '',
          onChange: ({ currentTarget }) => {
            onSearchInputChange(currentTarget.value);
          },
          onSearchChange,
        }}
        showTopSearch
        loading={loading}
        options={pageSizeOption}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
};

export default forwardRef<ITransfersRef, ITransfersProps>(Transfers);
