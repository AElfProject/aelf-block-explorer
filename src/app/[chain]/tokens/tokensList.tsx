'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getColumns from './columnConfig';
import { useMobileAll } from '@_hooks/useResponsive';
import { ITokenList, ITokenListItem } from '../token/[tokenSymbol]/type';
import { useParams } from 'next/navigation';
import { fetchTokenList } from '@_api/fetchTokens';
import { TChainID } from '@_api/type';
import { getPageNumber } from '@_utils/formatter';
import { pageSizeOption } from '@_utils/contant';
import { SortEnum } from '@_types/common';

interface TokensListProps {
  SSRData: ITokenList;
}

export default function TokensList({ SSRData }: TokensListProps) {
  console.log(SSRData, 'tokenSSRData');
  const { isMobile } = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<ITokenListItem[]>(SSRData.list);
  const [sort, setSort] = useState<SortEnum>(SortEnum.desc);

  const { chain } = useParams();

  const mountRef = useRef(true);

  const fetchData = useCallback(async () => {
    const params = {
      skipCount: getPageNumber(currentPage, pageSize),
      maxResultCount: pageSize,
      chainId: chain as TChainID,
      sort,
      orderBy: 'HolderCount',
    };
    setLoading(true);
    const data = await fetchTokenList(params);
    setTotal(data.total);
    setData(data.list);
    setLoading(false);
    return data;
  }, [chain, currentPage, pageSize, sort]);

  useEffect(() => {
    if (mountRef.current) {
      mountRef.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  const ChangeOrder = useCallback(() => {
    if (loading) return;
    setSort(sort === SortEnum.desc ? SortEnum.asc : SortEnum.desc);
  }, [loading, sort]);

  const columns = useMemo(
    () => getColumns({ currentPage, pageSize, sort, ChangeOrder, chain }),
    [ChangeOrder, chain, currentPage, pageSize, sort],
  );
  const title = useMemo(() => `A total of ${total} ${total <= 1 ? 'token' : 'tokens'} found`, [total]);

  const pageChange = async (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = async (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };

  return (
    <div>
      <HeadTitle content="Tokens" />
      <Table
        headerTitle={{
          single: {
            title,
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        options={pageSizeOption}
        rowKey="rank"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
