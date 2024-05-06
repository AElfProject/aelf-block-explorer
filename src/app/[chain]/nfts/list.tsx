'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import { useMobileContext } from '@app/pageProvider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getColumns from './columnConfig';
import { INFTsTableData, INFTsTableItem } from './type';
import { getPageNumber } from '@_utils/formatter';
import { useParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import { SortEnum } from '@_types/common';
import { fetchNFTSList } from '@_api/fetchNFTS';
import { pageSizeOption } from '@_utils/contant';

interface TokensListProps {
  SSRData: INFTsTableData;
}

export default function TokensList({ SSRData }: TokensListProps) {
  console.log(SSRData, 'SSRData');
  const { isMobileSSR: isMobile } = useMobileContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<INFTsTableItem[]>(SSRData.list);
  const [sort, setSort] = useState<SortEnum>(SortEnum.desc);

  const mountRef = useRef(true);

  const { chain } = useParams();
  const fetchData = useCallback(async () => {
    const params = {
      skipCount: getPageNumber(currentPage, pageSize),
      maxResultCount: pageSize,
      chainId: chain as TChainID,
      sort,
      orderBy: 'HolderCount',
    };
    setLoading(true);
    const data = await fetchNFTSList(params);
    setTotal(data.total);
    setData(data.list);
    setLoading(false);
    return data;
  }, [chain, currentPage, pageSize, sort]);

  const ChangeOrder = useCallback(() => {
    if (loading) return;
    setSort(sort === SortEnum.desc ? SortEnum.asc : SortEnum.desc);
  }, [loading, sort]);

  const columns = useMemo(
    () => getColumns({ currentPage, pageSize, ChangeOrder, sort, chain }),
    [ChangeOrder, chain, currentPage, pageSize, sort],
  );

  const pageChange = async (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = async (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };

  useEffect(() => {
    if (mountRef.current) {
      mountRef.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  const title = useMemo(() => `A total of ${total} ${total <= 1 ? 'collection' : 'collections'} found`, [total]);

  return (
    <div>
      <HeadTitle content="NFTs" />
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
        rowKey={(item) => {
          return item.nftCollection?.symbol;
        }}
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
