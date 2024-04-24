/*
 * @author: Peterbjx
 * @Date: 2023-08-16 18:51:11
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:05:43
 * @Description:
 */
'use client';
import clsx from 'clsx';
import HeadTitle from '@_components/HeaderTitle';
import { useMemo, useState, useCallback } from 'react';
import './detail.css';
import BaseInfo from './baseinfo';
import ExtensionInfo from './ExtensionInfo';
import type { ITabsProps } from 'aelf-design';
import Table from '@_components/Table';
import getColumns from '@app/transactions/columnConfig';
import { ITableDataType } from '@app/transactions/type';
import { ColumnsType } from 'antd/es/table';
import MoreContainer from '@_components/MoreContainer';
import EPTabs from '@_components/EPTabs';
import { useMobileContext } from '@app/pageProvider';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
import { IBlocksDetailData } from '@_api/type';

export default function Detail({ SSRData }) {
  const { isMobile } = useMobileAll();
  const [detailData] = useState<IBlocksDetailData>(SSRData);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [total] = useState<number>(SSRData.total);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<ITableDataType>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const multiTitle = `More than > ${total} transactions found`;

  const multiTitleDesc = `Showing the last 500k records`;

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (size) => {
    setPageSize(size);
  };
  const tableData = useMemo(() => {
    return detailData.transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [currentPage, detailData.transactions, pageSize]);

  const moreChange = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);
  const items: ITabsProps['items'] = [
    {
      key: '',
      label: 'Overview',
      children: (
        <div className="overview-container pb-4">
          <BaseInfo data={detailData} />
          {showMore && <ExtensionInfo data={detailData} />}
          <MoreContainer showMore={showMore} onChange={moreChange} />
        </div>
      ),
    },
    {
      key: 'txns',
      label: 'Transactions',
      children: (
        <Table
          headerTitle={{
            multi: {
              title: multiTitle,
              desc: multiTitleDesc,
            },
          }}
          dataSource={tableData}
          columns={columns}
          isMobile={isMobile}
          rowKey="transactionHash"
          total={total}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      ),
    },
  ];

  return (
    <div className={clsx('token-detail-container')}>
      <HeadTitle content="Blocks">
        <span className="ml-2 block text-xs leading-5 text-base-200">#{detailData.blockHeight}</span>
      </HeadTitle>

      <div className="detail-table">
        <EPTabs items={items} />
      </div>
    </div>
  );
}
