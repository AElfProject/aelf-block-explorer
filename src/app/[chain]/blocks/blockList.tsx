/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:57:13
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 17:02:47
 * @Description: BlockList
 */
'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { IBlocksResponse, IBlocksResponseItem } from '@_api/type';
import { pageSizeOption } from '@_utils/contant';
import { fetchBlocks } from '@_api/fetchBlocks';
import { useAppSelector } from '@_store';
import { useParams } from 'next/navigation';
import { Spin } from 'antd';
import { reloadBlockListData } from '@/app/actions';
import { getPageNumber } from '@_utils/formatter';

export enum pageType {
  first,
  prev,
  next,
  last,
}

export interface IBlocksData {
  total: number;
  blocks: IBlocksResponseItem[];
}

export default function BlockList({ SSRData }) {
  console.log(SSRData, ' SSRData');
  const { isMobile } = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<IBlocksResponseItem[]>(SSRData.blocks);
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  const { chain } = useParams();
  const fetchData = useCallback(
    async (page, size) => {
      const params = {
        chainId: defaultChain || 'AELF',
        skipCount: getPageNumber(page, size),
        maxResultCount: size,
      };
      setLoading(true);
      try {
        const res: IBlocksResponse = await fetchBlocks(params);
        setTotal(res.total);
        setData(res.blocks);
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    },
    [defaultChain],
  );

  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<IBlocksResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      chianId: chain,
    });
  }, [chain, timeFormat]);
  useEffect(() => {
    reloadBlockListData();
  }, []);

  const pageMaxBlock = data[0]?.blockHeight;
  const pageMinBlock = data[data.length - 1]?.blockHeight;

  const pageChange = async (page: number) => {
    setCurrentPage(page);
    fetchData(page, pageSize);
  };

  const pageSizeChange = async (page: number, pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(page);
    fetchData(page, pageSize);
  };

  const multiTitle = useMemo(() => {
    return `Total of ${total} blocks`;
  }, [total]);
  return (
    <div>
      <HeadTitle content="Blocks"></HeadTitle>
      <Spin spinning={loading}>
        <Table
          headerTitle={{
            multi: {
              title: multiTitle,
              desc: `(Showing blocks between #${pageMinBlock} to #${pageMaxBlock})`,
            },
          }}
          loading={false}
          dataSource={data}
          columns={columns}
          isMobile={isMobile}
          rowKey="blockHeight"
          total={total}
          options={pageSizeOption}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      </Spin>
    </div>
  );
}
