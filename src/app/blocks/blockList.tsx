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
import { useCallback, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { IBlocksResponse, IBlocksResponseItem } from '@_api/type';
import { pageSizeOption } from '@_utils/contant';
import { fetchBlocks } from '@_api/fetchBlocks';
import { useAppSelector } from '@_store';

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
  const { isMobile } = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<IBlocksResponseItem[]>(SSRData.blocks);
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  const totalPage = Math.floor((total + pageSize - 1) / pageSize) || 1;
  const fetchData = useCallback(
    async (pageSize, type: pageType) => {
      let blockHeight;
      if (type === pageType.next) {
        blockHeight = Math.round(data[data.length - 1].blockHeight - 1);
      } else if (type === pageType.prev) {
        blockHeight = Math.round(data[0].blockHeight + 1);
      } else if (type === pageType.last) {
        blockHeight = Math.round(data[0].blockHeight - pageSize * (totalPage - currentPage));
      } else {
        blockHeight = undefined;
      }
      const params = {
        chainId: defaultChain || 'AELF',
        blockHeight: blockHeight,
        maxResultCount: pageSize,
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
    [currentPage, data, defaultChain, totalPage],
  );
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<IBlocksResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const pageMaxBlock = data[0]?.blockHeight;
  const pageMinBlock = data[data.length - 1]?.blockHeight;

  const pageChange = async (page: number) => {
    setCurrentPage(page);
    if (page === totalPage) {
      fetchData(pageSize, pageType.last);
    } else if (page === 1) {
      fetchData(pageSize, pageType.first);
    } else if (page > currentPage) {
      fetchData(pageSize, pageType.next);
    } else {
      fetchData(pageSize, pageType.prev);
    }
  };

  const pageSizeChange = async (page: number, pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(page);
    fetchData(pageSize, pageType.first);
  };

  const multiTitle = useMemo(() => {
    return `Total of ${total} blocks`;
  }, [total]);
  return (
    <div>
      <HeadTitle content="Blocks"></HeadTitle>
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: `(Showing blocks between #${pageMinBlock} to #${pageMaxBlock})`,
          },
        }}
        loading={loading}
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
    </div>
  );
}
