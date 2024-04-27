'use client';
import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IHolderItem, ITokenSearchProps } from '../../type';
import getColumns from './columns';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchTokenDetailHolders } from '@_api/fetchTokens';
import { useParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import { getPageNumber } from '@_utils/formatter';
import { pageSizeOption } from '@_utils/contant';

interface HoldersProps extends ITokenSearchProps {}

export default function Holders({ search, onSearchChange, onSearchInputChange }: HoldersProps) {
  const { isMobile } = useMobileAll();

  const { chain, tokenSymbol } = useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<IHolderItem[]>();
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        chainId: chain as TChainID,
        symbol: tokenSymbol as string,
        skipCount: getPageNumber(currentPage, pageSize),
        maxResultCount: pageSize,
      };
      const res = await fetchTokenDetailHolders(params);
      setData(res.list);
      setTotal(res.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [chain, tokenSymbol, currentPage, pageSize]);

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

  const columns = useMemo(() => getColumns({ currentPage, pageSize, chain }), [currentPage, pageSize, chain]);
  const title = useMemo(() => `A total of ${total} ${total <= 1 ? 'token' : 'tokens'} found`, [total]);

  return (
    <div>
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
        // showTopSearch
        loading={loading}
        dataSource={data}
        columns={columns}
        options={pageSizeOption}
        isMobile={isMobile}
        rowKey="index"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
