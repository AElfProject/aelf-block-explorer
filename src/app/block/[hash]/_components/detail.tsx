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
import { useMemo, useState } from 'react';
import './detail.css';
import BaseInfo from './baseinfo';
import ExtensionInfo from './ExtensionInfo';
import { DetailData } from './type';
import DetailContainer from '@_components/DetailContainer';
import IconFont from '@_components/IconFont';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Table from '@_components/Table';
import getColumns from '@app/transactions/columnConfig';
import { TableDataType } from '@app/transactions/type';
import { ColumnsType } from 'antd/es/table';

export default function Detail({ SSRData }) {
  const [detailData] = useState<DetailData>(SSRData);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const handleTimeChange = () => {
    if (timeFormat === 'Age') {
      setTimeFormat('Date Time (UTC)');
    } else {
      setTimeFormat('Age');
    }
  };
  const columns = useMemo<ColumnsType<TableDataType>>(() => {
    return getColumns({ timeFormat, handleTimeChange });
  }, [timeFormat]);

  const multiTitle = useMemo(() => {
    return `More than > ${total} transactions found`;
  }, [total]);

  const multiTitleDesc = useMemo(() => {
    return `Showing the last 500k records`;
  }, []);

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (size) => {
    setPageSize(size);
  };
  const tableData = useMemo(() => {
    return detailData.transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [currentPage, pageSize]);
  const MoreContainer = useMemo(() => {
    const infoList = [
      {
        label: 'More Details ',
        value: (
          <div
            className="flex justify-start items-center"
            onClick={() => {
              setShowMore(!showMore);
            }}>
            <IconFont className="text-xs" type={showMore ? 'Less' : 'More'} />
            <span className="cursor-pointer text-link ml-1">Click to show {showMore ? 'less' : 'more'}</span>
          </div>
        ),
      },
    ];
    return <DetailContainer infoList={infoList} />;
  }, [showMore]);
  const items: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <div className="overview-container">
          <BaseInfo data={detailData} />
          {showMore && <ExtensionInfo data={detailData} />}
          {MoreContainer}
        </div>
      ),
    },
    {
      key: 'transactions',
      label: 'Transactions',
      children: (
        <Table
          titleType="multi"
          dataSource={tableData}
          columns={columns}
          isMobile={false}
          rowKey="transactionHash"
          total={total}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}
          multiTitle={multiTitle}
          multiTitleDesc={multiTitleDesc}></Table>
      ),
    },
  ];

  const [activeKey, setActiveKey] = useState<string>(window.location.hash === '#txns' ? 'transactions' : 'overview');
  const tabChange = (activeKey) => {
    if (activeKey === 'overview') {
      window.location.hash = '';
    } else {
      window.location.hash = 'txns';
    }
    setActiveKey(activeKey);
  };

  return (
    <div className={clsx('token-detail-container')}>
      <HeadTitle content="Blocks">
        <span className="text-base-200 ml-2 block text-xs leading-5">#{detailData.blockHeight}</span>
      </HeadTitle>

      <div className="detail-table">
        <Tabs defaultActiveKey={activeKey} activeKey={activeKey} items={items} onChange={tabChange} />
      </div>
    </div>
  );
}
